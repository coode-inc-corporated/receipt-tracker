import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';


@Module({
  imports: [ ConfigModule.forRoot({

    isGlobal: true,
    envFilePath: [
    `apps/telegram/.env.${process.env.NODE_ENV || 'development'}.local`,
    `apps/telegram/.env.${process.env.NODE_ENV || 'development'}`,

  ],
  }),
  CoreModule,
],

  controllers: [TelegramController],
  providers: [TelegramService],
})

export class TelegramModule {}
