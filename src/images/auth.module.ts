import { ConfigurableModuleBuilder, Module } from "@nestjs/common";
import { AwsS3Service } from "@/src/files/application/services/files/aws-s3.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { ImageService } from "@/images/application/services/image/image.service";
import { ImageController } from "@/images/api/image/image.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
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
  controllers: [ImageController],
  providers: [AwsS3Service, ImageService, PrismaService],
  exports: [AwsS3Service, ImageService, PrismaService],
})
export class ImageModule {}
