import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "@/auth/application/services/auth/auth.service";
import { LoginDto } from "@/auth/api/dtos/login.dto";
import { RegisterDto } from "@/auth/api/dtos/register.dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @UseGuards(JwtAuthGuard)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register({
      email: registerDto.email,
      password: registerDto.password,
    });
  }
}
