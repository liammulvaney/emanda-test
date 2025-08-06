import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: '*',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Accept', 'Content-Encoding', 'Content-Type', 'Accept-Encoding', 'Authorization', 'Action'],
  //   optionsSuccessStatus: 200
  // });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
