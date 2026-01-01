import { Module } from '@nestjs/common';
import { DataUploadController } from './api/data-upload.controller';
import { BulkUploadService } from './application/bulk-upload.service';
import { DataUploadRepository } from './infrastructure/data-upload.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { DATA_UPLOAD_REPOSITORY_TOKEN } from '../../infrastructure/database/constants';

@Module({
  imports: [DatabaseModule],
  controllers: [DataUploadController],
  providers: [
    BulkUploadService,
    {
      provide: DATA_UPLOAD_REPOSITORY_TOKEN,
      useClass: DataUploadRepository,
    },
  ],
  exports: [BulkUploadService],
})
export class DataUploadModule {}