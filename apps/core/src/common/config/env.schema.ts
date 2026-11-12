import { z } from 'zod';


//схема валидации переменных окружения Core
export const envSchema = z.object({
  HOST: z.string().trim().min(1).default('localhost'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  NODE_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),

  SWAGGER_ENABLED: z.enum(['true', 'false']).optional(),

  CORS_ALLOWED_ORIGINS: z.string().default(''),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

});
