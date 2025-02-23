import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "@/auth/application/services/auth/auth.service";
import { LoginDto } from "@/auth/api/dtos/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
