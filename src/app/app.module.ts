import { Module } from "@nestjs/common";
import { AuthModule } from "@/auth/auth.module";
import { FileModule } from "@/files/auth.module";
import { ImageModule } from "@/images/auth.module";

@Module({
  imports: [AuthModule, FileModule, ImageModule],
})
export class AppModule {}
