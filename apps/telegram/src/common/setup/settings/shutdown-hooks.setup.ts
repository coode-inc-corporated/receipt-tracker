import type { INestApplication } from '@nestjs/common';

export function shutdownHooksSetup(app: INestApplication): void {
  app.enableShutdownHooks();
}
