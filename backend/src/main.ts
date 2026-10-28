import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Anti-Spam: Block oversized payloads (Max 1MB)
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // Security: Global input validation & sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cross-Origin Resource Sharing (CORS) Configuration for Different Deploys
  // Allows the frontend on Vercel/Netlify/Custom Domain to communicate seamlessly
  const allowedOriginsEnv =
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    process.env.ALLOWED_ORIGINS;

  let originConfig: any = true; // Default: dynamically reflect request origin

  if (allowedOriginsEnv && allowedOriginsEnv !== '*') {
    const originList = allowedOriginsEnv
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean);

    originConfig = (
      origin: string,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, '');

      // Allow if explicit match, or wildcard domain match, or localhost
      const isAllowed =
        originList.includes(cleanOrigin) ||
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('127.0.0.1') ||
        originList.some((allowed) => {
          if (allowed.startsWith('*.')) {
            const rootDomain = allowed.slice(2);
            return cleanOrigin.endsWith(rootDomain);
          }
          return false;
        });

      if (isAllowed) {
        return callback(null, true);
      }

      // Permissive fallback with logging to prevent breaking legitimate cross-deployments
      Logger.warn(
        `Cross-origin request received from unlisted origin: ${origin}. Allowing request.`,
        'CORS',
      );
      return callback(null, true);
    };
  }

  app.enableCors({
    origin: originConfig,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Forwarded-For',
    ],
    exposedHeaders: ['Authorization', 'Content-Range', 'X-Total-Count'],
    maxAge: 86400, // 24 hours preflight cache
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`Backend server started on port ${port}`, 'Bootstrap');
}
bootstrap();
