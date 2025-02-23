import { ConfigurableModuleBuilder, Module } from "@nestjs/common";
import { AwsS3Service } from "@/src/files/application/services/files/aws-s3.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FilesController } from "@/files/api/files/files.controller";
import { JwtModule } from "@nestjs/jwt";
import { FileService } from "@/files/application/services/files/file.service";
import { PrismaService } from "@/shared/prisma/prisma.service";

@Module({
  imports: [
    ConfigurableModuleBuilder,
    ConfigModule,
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
  controllers: [FilesController],
  providers: [AwsS3Service, FileService, PrismaService],
  exports: [AwsS3Service, FileService, PrismaService],
})
export class FileModule {}
