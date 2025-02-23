import { IsNotEmpty } from "class-validator";

export class CreateFileDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  userId: string;
}
