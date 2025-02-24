import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchImageDto {
  @ApiProperty({ description: "Search term for images" })
  @IsString()
  @IsNotEmpty()
  query: string;
}
