import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/shared/prisma/prisma.service";

@Injectable()
export class ResetTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createResetToken(userId: string, token: string, expiresAt: Date) {
    return await this.prisma.resetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findToken(token: string) {
    return await this.prisma.resetToken.findUnique({
      where: { token },
    });
  }

  async deleteToken(token: string) {
    return await this.prisma.resetToken.delete({
      where: { token },
    });
  }
}
