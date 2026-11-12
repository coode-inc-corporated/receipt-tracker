import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramConfig {
  get host(): string {
    return this.config.getOrThrow<string>('HOST');
  }

  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.getOrThrow<number>('PORT');
  }
}
