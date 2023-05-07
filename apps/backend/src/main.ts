import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthenticatedSocketAdapter } from './socketConfig/authenticated-socket-adapter';
import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./key.pem'),
  //   cert: fs.readFileSync('./cert.pem'),
  // };
  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
    cors: true,
    snapshot: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));
  await app.listen(10001);
}
bootstrap();
