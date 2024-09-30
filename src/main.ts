import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("before everything", process.env.POTATO)
  await app.listen(3000);
}
bootstrap();
