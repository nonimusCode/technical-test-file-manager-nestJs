import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class UploadImageDto {
  @ApiProperty({ description: "URL of the image to upload" })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
