import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 3001);

  console.log(
    `🚀 Mirokai API running on http://localhost:${process.env.PORT ?? 3001}/api`,
  );
}

void bootstrap();
