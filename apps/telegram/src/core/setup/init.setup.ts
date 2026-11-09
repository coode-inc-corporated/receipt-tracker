import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { shutdownHooksSetup } from './settings/shutdown-hooks.setup';

export function initSetup(app: NestFastifyApplication): void {
  shutdownHooksSetup(app);
}
