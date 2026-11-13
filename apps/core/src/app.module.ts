import { configModule } from './config-dynamic-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { CoreModule } from './common/core.module';



@Module({
  imports: [
  configModule,
  CoreModule,
  InfrastructureModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
