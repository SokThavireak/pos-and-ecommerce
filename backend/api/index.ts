import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express, { Request, Response } from 'express';

const server = express();
let isInitialized = false;

async function createServer() {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
      ],
      exposedHeaders: ['Authorization'],
    });

    await app.init();
    isInitialized = true;
  }
  return server;
}

export default async function handler(req: Request, res: Response) {
  const app = await createServer();
  return app(req, res);
}
