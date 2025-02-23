import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "@/src/auth/api/dtos/login.dto";
import { RegisterDto } from "@/src/auth/api/dtos/register.dto";
import { ResetTokenService } from "@/auth/application/services/reset-token/reset-token.service";
import { MailService } from "../mail/mail.service";
import { UserService } from "../user/user.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly resetTokenService: ResetTokenService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    return user;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      return { access_token: token };
    } catch {
      throw new UnauthorizedException("Invalid email or password");
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new ConflictException("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { message: "User registered successfully", userId: newUser.id };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.resetTokenService.createResetToken(user.id, token, expiresAt);

    await this.mailService.sendPasswordResetEmail(email, token);
    return { message: "Correo de recuperación enviado." };
  }

  async resetPassword(token: string, password: string) {
    const resetToken = await this.resetTokenService.findToken(token);
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new NotFoundException("Token inválido o expirado.");
    }

    const user = await this.userService.findById(resetToken.userId);

    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await this.userService.updateUser(user);

    await this.resetTokenService.deleteToken(token);
    return { message: "Contraseña restablecida con éxito." };
  }
}
