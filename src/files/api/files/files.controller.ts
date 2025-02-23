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

@Controller("files")
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Request() req: ExpressRequest,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    const bucketName = this.configService.get<string>("AWS_BUCKET_NAME");
    if (!bucketName) {
      throw new BadRequestException("Invalid AWS credentials");
    }
    const { name } = uploadFileDto;
    const originalExt = extname(file.originalname);
    const finalName = name.includes(".") ? name : name + originalExt;
    const key = `PruebaTecnicaJuan/${finalName}`;
    const result = await this.awsS3Service.uploadFile(file, bucketName, key);

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
  async getFile(@Param("id") id: string) {
    const file = await this.fileService.findFileById(id);
    if (!file) {
      throw new NotFoundException("File not found");
    }
    return file;
  }

  @Get("download/:id")
  async downloadFile(@Param("id") id: string) {
    const file = await this.fileService.findFileById(id);

    if (!file?.key || typeof file.key !== "string") {
      throw new NotFoundException("File not found");
    }

    const bucketName = this.configService.get<string>("AWS_BUCKET_NAME");
    if (!bucketName) {
      throw new InternalServerErrorException(
        "AWS bucket name is not configured",
      );
    }

    try {
      const url = await this.awsS3Service.getFile(file.key, bucketName);
      return { url };
    } catch (error) {
      console.error("Error downloading file from S3:", error);
      throw new InternalServerErrorException("Error downloading file");
    }
  }

  @Put("update/:id")
  async updateFile(
    @Param("id") id: string,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return await this.fileService.updateFile(id, updateFileDto);
  }

  @Delete(":id")
  async deleteFile(@Param("id") id: string) {
    const file = await this.fileService.findFileById(id);
    if (!file) {
      throw new NotFoundException("File not found");
    }

    const bucketName = this.configService.get<string>("AWS_BUCKET_NAME");
    if (!bucketName) {
      throw new BadRequestException("Missing AWS bucket name");
    }

    await this.awsS3Service.deleteFile(file.key, bucketName);
    await this.fileService.deleteFile(id);

    return { message: "File deleted successfully" };
  }
}
