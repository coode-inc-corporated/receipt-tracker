import { z } from 'zod';

export const envSchema = z.object({
  HOST: z.string().trim().min(1).default('localhost'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  NODE_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),
});
