import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@app/infrastructure/schemas';
import { DRIZZLE_PROVIDER } from '@app/infrastructure/database/constants';

@Injectable()
export class BaseRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    protected readonly db: NodePgDatabase<typeof schema>,
  ) {}
}
