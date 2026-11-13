import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./common/config/env.schema";

export const configModuleTelegram = ConfigModule.forRoot({

     envFilePath: [
    `apps/telegram/.env.${process.env.NODE_ENV || 'development'}.local`,
    `apps/telegram/.env.${process.env.NODE_ENV || 'development'}`],

    isGlobal: true,
    validationSchema: envSchema,

  })