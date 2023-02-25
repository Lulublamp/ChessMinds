import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthenticatedSocketAdapter } from './socketConfig/authenticated-socket-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));
  await app.listen(3001);
}
bootstrap();
