import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { CoreConfig } from '../../config/core.config';

export function swaggerSetup(
  app: NestFastifyApplication,
  coreConfig: CoreConfig,
): void {
  if (!coreConfig.isSwaggerEnabled) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Receipt Tracker API')
    .setDescription('HTTP API сервиса Core')
    .setVersion('0.0.1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
}
