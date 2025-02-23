import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/shared/prisma/prisma.service";

@Injectable()
export class ResetTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createResetToken(userId: string, token: string, expiresAt: Date) {
    const existingToken = await this.prisma.resetToken.findUnique({
      where: { userId },
    });

    if (existingToken) {
      // Aquí puedes decidir qué hacer, por ejemplo, actualizar el token
      return await this.prisma.resetToken.update({
        where: { userId },
        data: { token, expiresAt },
      });
    } else {
      return await this.prisma.resetToken.create({
        data: { userId, token, expiresAt },
      });
    }
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
