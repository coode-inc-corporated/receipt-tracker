import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoreConfig {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return Number(this.config.get<string>('PORT') ?? 3000);
  }

  get isSwaggerEnabled(): boolean {
    const enabled = this.config.get<string>('SWAGGER_ENABLED');

    if (enabled !== undefined) {
      return enabled === 'true';
    }

    return this.config.get<string>('NODE_ENV') !== 'production';
  }
}
