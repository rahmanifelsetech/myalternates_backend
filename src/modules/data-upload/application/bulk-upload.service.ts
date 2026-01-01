import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { DataUploadRepositoryInterface } from '../domain/data-upload.repository.interface';
import { DATA_UPLOAD_REPOSITORY_TOKEN } from '../../../infrastructure/database/constants';
import { UploadDailyValuationDto, UploadHoldingDto, UploadMarketListDto, UploadTransactionDto, UploadIndexHistoryDto } from '../api/dto/upload-data.dto';

@Injectable()
export class BulkUploadService {
  constructor(
    @Inject(DATA_UPLOAD_REPOSITORY_TOKEN)
    private readonly dataUploadRepository: DataUploadRepositoryInterface,
  ) {}

  private parseExcel<T>(file: Express.Multer.File): T[] {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json<T>(worksheet);
  }

  async uploadDailyValuations(file: Express.Multer.File) {
    const data = this.parseExcel<UploadDailyValuationDto>(file);
    // TODO: Validate data against DTOs manually or using validation pipe if needed per row
    await this.dataUploadRepository.bulkInsertDailyValuations(data);
    return { count: data.length, message: 'Daily valuations uploaded successfully' };
  }

  async uploadHoldings(file: Express.Multer.File) {
    const data = this.parseExcel<UploadHoldingDto>(file);
    await this.dataUploadRepository.bulkInsertHoldings(data);
    return { count: data.length, message: 'Holdings uploaded successfully' };
  }

  async uploadMarketList(file: Express.Multer.File) {
    const data = this.parseExcel<UploadMarketListDto>(file);
    await this.dataUploadRepository.bulkInsertMarketList(data);
    return { count: data.length, message: 'Market list uploaded successfully' };
  }

  async uploadTransactions(file: Express.Multer.File) {
    const data = this.parseExcel<UploadTransactionDto>(file);
    await this.dataUploadRepository.bulkInsertTransactions(data);
    return { count: data.length, message: 'Transactions uploaded successfully' };
  }

  async uploadIndexHistory(file: Express.Multer.File) {
    const data = this.parseExcel<UploadIndexHistoryDto>(file);
    await this.dataUploadRepository.bulkInsertIndexHistory(data);
    return { count: data.length, message: 'Index history uploaded successfully' };
  }

  // Search Methods
  async searchDailyValuations(startDate?: string, endDate?: string, clientName?: string) {
    return this.dataUploadRepository.searchDailyValuations(startDate, endDate, clientName);
  }

  async searchHoldings(startDate?: string, endDate?: string, clientName?: string) {
    return this.dataUploadRepository.searchHoldings(startDate, endDate, clientName);
  }

  async searchMarketList(companyName?: string) {
    return this.dataUploadRepository.searchMarketList(companyName);
  }

  async searchTransactions(startDate?: string, endDate?: string, clientName?: string) {
    return this.dataUploadRepository.searchTransactions(startDate, endDate, clientName);
  }

  async searchIndexHistory(startDate?: string, endDate?: string, schemeName?: string) {
    return this.dataUploadRepository.searchIndexHistory(startDate, endDate, schemeName);
  }
}