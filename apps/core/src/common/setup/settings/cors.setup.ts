import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { CoreConfig } from '../../config/core.config';

export function corsSetup(
  app: NestFastifyApplication,
  coreConfig: CoreConfig,
): void {
  const allowedOrigins =
    coreConfig.env === 'production' ? coreConfig.corsAllowedOrigins : '*';

  app.enableCors({
    origin: allowedOrigins,
    credentials: false,
  });
}
