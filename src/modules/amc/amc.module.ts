import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/infrastructure/database/database.module';
import { AmcController } from './api/amc.controller';
import { AmcService } from './application/amc.service';
import { AmcRepository } from './infrastructure/amc.repository';
import { AMC_REPOSITORY_TOKEN } from './domain/amc.repository.interface';
import { FileUploadModule } from '@app/shared/modules/file-upload/file-upload.module';

@Module({
  imports: [DatabaseModule, FileUploadModule],
  controllers: [AmcController],
  providers: [
    AmcService,
    {
      provide: AMC_REPOSITORY_TOKEN,
      useClass: AmcRepository,
    },
  ],
  exports: [AmcService],
})
export class AmcModule {}