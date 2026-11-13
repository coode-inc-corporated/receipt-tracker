import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./common/config/env.schema";

export const configModule =  ConfigModule.forRoot({
    envFilePath: [
    process.env.ENV_FILE_PATH?.trim() || '',
    `apps/core/.env.${process.env.NODE_ENV || 'development'}.local`,
    `apps/core/.env.${process.env.NODE_ENV || 'development'}`,
    'apps/core/.env',
    ],
    isGlobal: true,
    validationSchema: envSchema,
  })