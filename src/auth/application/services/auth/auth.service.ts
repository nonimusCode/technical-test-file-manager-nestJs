import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "@/src/auth/api/dtos/login.dto";
import { RegisterDto } from "@/src/auth/api/dtos/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
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
}
