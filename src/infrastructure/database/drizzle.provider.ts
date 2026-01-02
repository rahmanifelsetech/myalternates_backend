import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@app/infrastructure/schemas';
import { DRIZZLE_PROVIDER } from './constants';


export const DrizzleProvider: FactoryProvider = {
  provide: DRIZZLE_PROVIDER,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const connectionString = configService.get<string>('database.url');
    const pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    return drizzle(pool, { schema });
  },
};
