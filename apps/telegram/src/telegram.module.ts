import { configModuleTelegram } from './config-dynamic-module';
import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { CoreModule } from './common/core.module';



@Module({
  imports: [ 
  configModuleTelegram,
  CoreModule,
],

  controllers: [TelegramController],
  providers: [TelegramService],
})

export class TelegramModule {}
