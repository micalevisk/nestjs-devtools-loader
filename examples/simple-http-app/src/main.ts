import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  // Use case 1: default adapter, default options
  const app = await NestFactory.create(AppModule);

  // Use case 2: custom adapter, default options
  // const app = await NestFactory.create(AppModule, new FastifyAdapter());

  // Use case 3: default adatper, custom options
  // const app = await NestFactory.create(AppModule, { logger: ['debug'] });

  // Use case 4: custom adatper, custom options
  // const app = await NestFactory.create(AppModule, new FastifyAdapter(), { logger: ['debug'] });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
