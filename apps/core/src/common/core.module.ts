import { Module } from '@nestjs/common';
import { CoreConfig } from './config/core.config';

@Module({
  providers: [CoreConfig],
  exports: [CoreConfig],
})

export class CoreModule {}