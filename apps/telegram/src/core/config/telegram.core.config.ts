import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TelegramConfig {

     constructor(private readonly config: ConfigService){}

      get port(): number {
        return Number(this.config.get<string>('PORT') ?? 3001)
      }
}