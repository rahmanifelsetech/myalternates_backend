import { UploadDailyValuationDto, UploadHoldingDto, UploadMarketListDto, UploadTransactionDto, UploadIndexHistoryDto } from '../api/dto/upload-data.dto';

export abstract class DataUploadRepositoryInterface {
  // Bulk Inserts
  abstract bulkInsertDailyValuations(data: UploadDailyValuationDto[]): Promise<void>;
  abstract bulkInsertHoldings(data: UploadHoldingDto[]): Promise<void>;
  abstract bulkInsertMarketList(data: UploadMarketListDto[]): Promise<void>;
  abstract bulkInsertTransactions(data: UploadTransactionDto[]): Promise<void>;
  abstract bulkInsertIndexHistory(data: UploadIndexHistoryDto[]): Promise<void>;

  // Search / Filter
  abstract searchDailyValuations(startDate?: string, endDate?: string, clientName?: string): Promise<any[]>;
  abstract searchHoldings(startDate?: string, endDate?: string, clientName?: string): Promise<any[]>;
  abstract searchMarketList(companyName?: string): Promise<any[]>;
  abstract searchTransactions(startDate?: string, endDate?: string, clientName?: string): Promise<any[]>;
  abstract searchIndexHistory(startDate?: string, endDate?: string, schemeName?: string): Promise<any[]>;
}