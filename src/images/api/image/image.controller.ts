import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { ImageService } from "@/images/application/services/image/image.service";

@Controller("images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get("search")
  async searchImages(
    @Query("query") query: string,
  ): Promise<{ results: any[] }> {
    return this.imageService.searchImages(query);
  }

  @Post("upload")
  async uploadImage(
    @Body("imageUrl") imageUrl: string,
  ): Promise<{ url: string }> {
    return this.imageService.uploadImageFromUrl(imageUrl);
  }
}
