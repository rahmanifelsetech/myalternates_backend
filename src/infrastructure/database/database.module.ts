import { Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.provider';
import { DRIZZLE_PROVIDER, USERS_REPOSITORY_TOKEN } from './constants';


@Module({
  providers: [DrizzleProvider],
  exports: [
		DRIZZLE_PROVIDER, 
	],
  // exports: [DrizzleProvider],
})
export class DatabaseModule {}
