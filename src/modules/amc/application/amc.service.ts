import { Injectable, Inject } from '@nestjs/common';
import { AmcRepositoryInterface, AMC_REPOSITORY_TOKEN } from '../domain/amc.repository.interface';
import { CreateAmcDto, UpdateAmcDto } from '../api/dto/amc.dto';
import { PaginationQueryDto } from '@app/shared/api/dto/pagination-query.dto';
import { FileUploadService } from '@app/shared/modules/file-upload/application/file-upload.service';

@Injectable()
export class AmcService {
  constructor(
    @Inject(AMC_REPOSITORY_TOKEN)
    private readonly amcRepository: AmcRepositoryInterface,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createAmcDto: CreateAmcDto, logo: Express.Multer.File, user: any) {
    let logoUrl: string | undefined;
    if (logo) {
      logoUrl = await this.fileUploadService.saveFile(
        logo,
        user.appType.toLowerCase(),
        user.userCode,
      );
    }
    const amcData = { ...createAmcDto, logoUrl };
    return this.amcRepository.create(amcData);
  }

  async findAll(params: PaginationQueryDto) {
    return this.amcRepository.findAll(params);
  }

  async findById(id: string) {
    return this.amcRepository.findById(id);
  }

  async update(id: string, updateAmcDto: UpdateAmcDto, logo: Express.Multer.File, user: any) {
    const existingAmc = await this.amcRepository.findById(id);
    if (!existingAmc) {
      throw new Error('AMC not found');
    }

    const { filesToRemove, ...restData } = updateAmcDto;
    const amcData: any = { ...restData };

    // Handle file removal
    if (filesToRemove && filesToRemove.length > 0) {
      for (const field of filesToRemove) {
        const filePath = (existingAmc as any)[field];
        if (filePath) {
          await this.fileUploadService.deleteFile(filePath);
          amcData[field] = null;
        }
      }
    }

    let logoUrl: string | undefined;
    if (logo) {
      // If new logo uploaded, delete old one if it exists
      if (existingAmc.logoUrl) {
        await this.fileUploadService.deleteFile(existingAmc.logoUrl);
      }
      logoUrl = await this.fileUploadService.saveFile(
        logo,
        user.appType.toLowerCase(),
        user.userCode,
      );
      amcData.logoUrl = logoUrl;
    }

    return this.amcRepository.update(id, amcData);
  }

  async delete(id: string) {
    return this.amcRepository.delete(id);
  }
}