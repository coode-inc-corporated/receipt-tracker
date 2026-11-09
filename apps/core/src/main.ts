import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { CoreConfig } from './core/config/core.config';
import { initSetup } from './core/setup/init.setup';

async function bootstrap() {
  const logger = new Logger('Core');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const coreConfig = app.get(CoreConfig);

  initSetup(app);

  await app.listen(coreConfig.port);
  logger.log(`Core запущен на порту ${coreConfig.port}`);
}

void bootstrap();
