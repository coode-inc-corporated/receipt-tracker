import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';


@Module({
  imports: [
  ConfigModule.forRoot({
    envFilePath: [
    process.env.ENV_FILE_PATH?.trim() || '',
    `apps/core/.env.${process.env.NODE_ENV || 'development'}.local`,
    `apps/core/.env.${process.env.NODE_ENV || 'development'}`,
    'apps/core/.env',
    ],
    isGlobal: true,
  }),
  CoreModule,
  InfrastructureModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
