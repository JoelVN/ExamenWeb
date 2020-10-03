import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const session = require('express-session')
const FileStore = require('session-file-store')(session);
const express = require('express');
async function bootstrap() {
  const app = await NestFactory.create(AppModule) as any;

  app.set('view engine', 'ejs')
  app.use(express.static('publico'));
  app.use(
      session({
        name: 'server-session-id',
        secret: 'examen',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false},
        store: new FileStore(),
      }),
  );
  await app.listen(3000);
}
bootstrap();
