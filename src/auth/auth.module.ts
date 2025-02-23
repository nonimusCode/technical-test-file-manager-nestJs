import { Module } from "@nestjs/common";
import { AuthService } from "./application/services/auth/auth.service";
import { AuthController } from "./api/auth/auth.controller";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secretKey",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
