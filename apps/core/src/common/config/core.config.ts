import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoreConfig {
  constructor(private readonly config: ConfigService) {}

  get host(): string {
    return this.config.getOrThrow<string>('HOST');
  }

  get port(): number {
    return this.config.get<number>('PORT') ?? 3000;
  }

  get isSwaggerEnabled(): boolean {
    const enabled = this.config.get<string>('SWAGGER_ENABLED');

    if (enabled !== undefined) {
      return enabled === 'true';
    }

    return this.config.get<string>('NODE_ENV') !== 'production';
  }

  get env(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get corsAllowedOrigins(): string[] {
  return this.config
    .get<string>('CORS_ALLOWED_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
}
