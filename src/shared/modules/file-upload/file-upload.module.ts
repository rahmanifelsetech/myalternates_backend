import { Module, Global } from '@nestjs/common';
import { FileUploadService } from './application/file-upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: './storage', // Default destination, can be overridden by config
    }),
    ConfigModule,
  ],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}