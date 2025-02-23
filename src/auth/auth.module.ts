import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./application/services/auth/auth.service";
import { MailService } from "./application/services/mail/mail.service";
import { ResetTokenService } from "./application/services/reset-token/reset-token.service";
import { UserService } from "./application/services/user/user.service";
import { AuthController } from "./api/auth/auth.controller";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { Mailer } from "@/src/contexts/shared/mail/mailer";

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "fallbackSecret",
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtAuthGuard,
    Mailer,
    MailService,
    ResetTokenService,
    UserService,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    Mailer,
    MailService,
    ResetTokenService,
    UserService,
  ],
})
export class AuthModule {}
