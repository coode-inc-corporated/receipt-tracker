import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './common/core.module';
import { envSchema } from './common/config/env.schema';


@Module({
  imports: [ ConfigModule.forRoot({

    isGlobal: true,
    validationSchema: envSchema,
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
