import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: "your_token_here",
    description: "Token de restablecimiento",
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: "new_secure_password",
    description: "Nueva contraseña",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
