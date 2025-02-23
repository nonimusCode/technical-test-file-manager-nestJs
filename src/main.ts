import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // configure for
  const config = new DocumentBuilder()
    .setTitle("File Manager API")
    .setDescription("API para la gestión de archivos")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().then(
  () => console.log(`Aplicación iniciada in port ${process.env.PORT}`),
  error => console.error("Error al iniciar la aplicación:", error),
);
