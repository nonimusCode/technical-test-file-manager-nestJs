import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "@/shared/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }
    return user;
  }

  async updateUser(user: User): Promise<User> {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: user.password,
      },
    });
  }
}
