import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Put,
  UseGuards,
  NotFoundException,
  Request,
  BadRequestException,
  Delete,
  InternalServerErrorException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AwsS3Service } from "@/files/application/services/files/aws-s3.service";
import { FileService } from "@/files/application/services/files/file.service";
import { UploadFileDto } from "@/files/api/dtos/upload-file.dto";
import { UpdateFileDto } from "@/files/api/dtos/update-file.dto";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { Request as ExpressRequest } from "express";
import { extname } from "path";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("Files")
@ApiBearerAuth()
@Controller("files")
@UseGuards(JwtAuthGuard)
export class FilesController {
  private readonly bucketName: string;
  private readonly awsBaseKey: string;

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {
    this.bucketName = this.configService.get<string>("AWS_BUCKET_NAME", "");
    this.bucketName = this.configService.get<string>("AWS_BASE_KEY", "");
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a file" })
  @ApiBody({ type: UploadFileDto })
  @ApiResponse({ status: 201, description: "File uploaded successfully." })
  @ApiResponse({ status: 400, description: "Invalid input or missing file." })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Request() req: ExpressRequest,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    if (!this.bucketName || this.awsBaseKey) {
      throw new BadRequestException("Invalid AWS credentials");
    }
    const { name } = uploadFileDto;
    const originalExt = extname(file.originalname);
    const finalName = name.includes(".") ? name : name + originalExt;
    const key = `${this.awsBaseKey}/${finalName}`;
    const result = await this.awsS3Service.uploadFile(
      file,
      this.bucketName,
      key,
    );

    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException("Invalid user token");
    }

    const createdFile = await this.fileService.createFile({
      name: finalName,
      url: result.Location,
      userId,
      key,
    });

    return { url: createdFile.url };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get file details" })
  @ApiParam({ name: "id", required: true })
  @ApiResponse({ status: 200, description: "File retrieved successfully." })
  @ApiResponse({ status: 404, description: "File not found." })
  async getFile(@Param("id") id: string) {
    const file = await this.fileService.findFileById(id);
    if (!file) {
      throw new NotFoundException("File not found");
    }
    return file;
  }

  @Get("download/:id")
  @ApiOperation({ summary: "Download a file" })
  @ApiParam({ name: "id", required: true })
  @ApiResponse({ status: 200, description: "File download link generated." })
  @ApiResponse({ status: 404, description: "File not found." })
  async downloadFile(@Param("id") id: string) {
    const file = await this.fileService.findFileById(id);

    if (!file?.key || typeof file.key !== "string") {
      throw new NotFoundException("File not found");
    }

    if (!this.bucketName) {
      throw new InternalServerErrorException(
        "AWS bucket name is not configured",
      );
    }

    try {
      const url = await this.awsS3Service.getFile(file.key, this.bucketName);
      return { url };
    } catch (error) {
      console.error("Error downloading file from S3:", error);
      throw new InternalServerErrorException("Error downloading file");
    }
  }

  @Put("update/:id")
  @ApiOperation({ summary: "Update a file" })
  @ApiParam({ name: "id", required: true })
  @ApiBody({ type: UpdateFileDto })
  @ApiResponse({ status: 200, description: "File updated successfully." })
  async updateFile(
    @Param("id") id: string,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return await this.fileService.updateFile(id, updateFileDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a file" })
  @ApiParam({ name: "id", required: true })
  @ApiResponse({ status: 200, description: "File deleted successfully." })
  @ApiResponse({ status: 404, description: "File not found." })
  async deleteFile(@Param("id") id: string) {
    const file = await this.fileService.findFileById(id);
    if (!file) {
      throw new NotFoundException("File not found");
    }

    if (!this.bucketName) {
      throw new BadRequestException("Missing AWS bucket name");
    }

    await this.awsS3Service.deleteFile(file.key, this.bucketName);
    await this.fileService.deleteFile(id);

    return { message: "File deleted successfully" };
  }
}
