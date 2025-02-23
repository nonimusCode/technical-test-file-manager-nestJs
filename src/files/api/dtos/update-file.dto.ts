import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateFileDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  url?: string;
}
