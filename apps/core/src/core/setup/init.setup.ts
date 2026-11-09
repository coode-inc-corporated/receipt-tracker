import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { CoreConfig } from '../config/core.config';
import { shutdownHooksSetup } from './settings/shutdown-hooks.setup';
import { swaggerSetup } from './settings/swagger.setup';

export function initSetup(app: NestFastifyApplication): void {
  const coreConfig = app.get(CoreConfig);

  shutdownHooksSetup(app);
  swaggerSetup(app, coreConfig);
}
