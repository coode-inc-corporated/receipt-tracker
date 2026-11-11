import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TelegramConfig {

     constructor(private readonly config: ConfigService){}

      get port(): number {
        return this.config.getOrThrow<number>('PORT');
      }
}
