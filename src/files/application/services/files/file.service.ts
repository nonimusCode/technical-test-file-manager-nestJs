import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { CreateFileDto } from "@/files/api/dtos/create-file.dto";
import { UpdateFileDto } from "@/files/api/dtos/update-file.dto";

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async createFile(createFileDto: CreateFileDto) {
    return this.prisma.file.create({
      data: createFileDto,
    });
  }

  async updateFile(id: string, updateFileDto: UpdateFileDto) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException("File not found");
    }

    return this.prisma.file.update({
      where: { id },
      data: updateFileDto,
    });
  }

  async findFileById(id: string) {
    return this.prisma.file.findUnique({
      where: { id },
    });
  }

  async deleteFile(id: string): Promise<void> {
    await this.prisma.file.delete({
      where: { id },
    });
  }
}
