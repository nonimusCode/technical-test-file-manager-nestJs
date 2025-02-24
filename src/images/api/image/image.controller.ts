import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ImageService } from "@/images/application/services/image/image.service";
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SearchImageDto } from "../dtos/search-image.dto";
import { UploadImageDto } from "../dtos/upload-image.dto";
import { JwtAuthGuard } from "@/src/auth/guards/jwt-auth.guard";

@ApiTags("Images")
@Controller("images")
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get("search")
  @ApiOperation({ summary: "Search images by query" })
  @ApiQuery({
    name: "query",
    type: String,
    description: "Search term for images",
  })
  @ApiResponse({
    status: 200,
    description: "Successful response",
    schema: { example: { results: [] } },
  })
  async searchImages(
    @Body() queryDto: SearchImageDto,
  ): Promise<{ results: any[] }> {
    return this.imageService.searchImages(queryDto.query);
  }

  @Post("upload")
  @ApiOperation({ summary: "Upload an image from a URL" })
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({
    status: 201,
    description: "Image uploaded successfully",
    schema: { example: { url: "https://example.com/image.jpg" } },
  })
  async uploadImage(
    @Body() uploadDto: UploadImageDto,
  ): Promise<{ url: string }> {
    return this.imageService.uploadImageFromUrl(uploadDto.imageUrl);
  }
}
