import { NestFactory } from '@nestjs/core';
import { FileUploadModule } from './file-upload/file-upload.module';

async function bootstrap() {
  const app = await NestFactory.create(FileUploadModule);
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
