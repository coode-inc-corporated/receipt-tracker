import { Module } from "@nestjs/common";
import { TelegramConfig } from "./config/telegram.core.config";

@Module({
    providers: [TelegramConfig],
    exports: [TelegramConfig]
})

export class CoreModule {}