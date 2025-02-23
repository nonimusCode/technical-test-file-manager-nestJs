import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { AxiosResponse } from "axios";

@Injectable()
export class ImageService {
  private readonly s3: S3;
  private readonly bucketName: string;
  private readonly unsplashApiUrl = "https://api.unsplash.com";

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3();
    this.bucketName = this.configService.get<string>("AWS_BUCKET_NAME", "");

    if (!this.bucketName) {
      throw new Error(
        "AWS_BUCKET_NAME is not defined in the environment variables.",
      );
    }
  }

  // Buscar imágenes en Unsplash
  async searchImages(query: string, perPage = 10): Promise<{ results: any[] }> {
    const accessKey = this.configService.get<string>("UNSPLASH_ACCESS_KEY", "");
    if (!accessKey) {
      throw new Error(
        "UNSPLASH_ACCESS_KEY is not defined in the environment variables.",
      );
    }

    const url = `${this.unsplashApiUrl}/search/photos?query=${query}&per_page=${perPage}`;

    try {
      const response: AxiosResponse<{ results: any[] }> = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        }),
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching images from Unsplash:", error);
      throw new InternalServerErrorException(
        "Failed to fetch images from Unsplash.",
      );
    }
  }

  async uploadImageFromUrl(imageUrl: string): Promise<{ url: string }> {
    try {
      const response: AxiosResponse<ArrayBuffer> = await lastValueFrom(
        this.httpService.get<ArrayBuffer>(imageUrl, {
          responseType: "arraybuffer",
        }),
      );

      const buffer = Buffer.from(response.data);
      const contentType: string =
        typeof response.headers["content-type"] === "string"
          ? response.headers["content-type"]
          : "image/jpeg";
      const extension: string = contentType.split("/")[1] ?? "jpg";
      const key = `${uuidv4()}.${extension}`;

      await this.s3
        .putObject({
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: "public-read",
        })
        .promise();

      return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      throw new InternalServerErrorException("Failed to upload image to S3.");
    }
  }
}
