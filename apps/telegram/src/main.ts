import { NestFactory } from '@nestjs/core';
import { TelegramModule } from './telegram.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { TelegramConfig } from './common/config/telegram.core.config';
import { initSetup } from './common/setup/init.setup';

async function bootstrap() {
  const logger = new Logger('Telegram');

  const app = await NestFactory.create<NestFastifyApplication>(
    TelegramModule,
    new FastifyAdapter(),
  );

  const coreConfig = app.get(TelegramConfig);

  initSetup(app);

  await app.listen(coreConfig.port);
  logger.log(`Telegram запущен на порту ${coreConfig.port}`);
}
void bootstrap();
