import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.use(helmet());

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      /\.vercel\.app$/,
      'https://your-custom-domain.com'
    ],
    credentials: true
  });

  app.useGlobalGuards(app.get(ThrottlerGuard));

  const port = configService.get<number>('PORT') ?? 4000;
  await app.listen(port);
}

bootstrap();
