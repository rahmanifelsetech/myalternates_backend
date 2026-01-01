import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/infrastructure/database/database.module';
import { SchemesController } from './api/schemes.controller';
import { SchemeService } from './application/scheme.service';
import { SchemeRepository } from './infrastructure/scheme.repository';
import { SCHEME_REPOSITORY_TOKEN } from './domain/scheme.repository.interface';

@Module({
  imports: [DatabaseModule],
  controllers: [SchemesController],
  providers: [
    SchemeService,
    {
      provide: SCHEME_REPOSITORY_TOKEN,
      useClass: SchemeRepository,
    },
  ],
  exports: [SchemeService],
})
export class SchemesModule {}