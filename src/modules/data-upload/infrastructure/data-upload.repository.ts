import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, like, ilike, SQL } from 'drizzle-orm';
import * as schema from '../../../infrastructure/schemas';
import { BaseRepository } from '../../../infrastructure/repositories/base/base.repository';
import { DataUploadRepositoryInterface } from '../domain/data-upload.repository.interface';
import { UploadDailyValuationDto, UploadHoldingDto, UploadMarketListDto, UploadTransactionDto, UploadIndexHistoryDto } from '../api/dto/upload-data.dto';

@Injectable()
export class DataUploadRepository extends BaseRepository implements DataUploadRepositoryInterface {
  
  async bulkInsertDailyValuations(data: any[]): Promise<void> {
    if (data.length === 0) return;
    await this.db.insert(schema.daily_valuations).values(data);
  }

  async bulkInsertHoldings(data: any[]): Promise<void> {
    if (data.length === 0) return;
    await this.db.insert(schema.holdings).values(data);
  }

  async bulkInsertMarketList(data: any[]): Promise<void> {
    if (data.length === 0) return;
    await this.db.insert(schema.market_list).values(data);
  }

  async bulkInsertTransactions(data: any[]): Promise<void> {
    if (data.length === 0) return;
    await this.db.insert(schema.transactions).values(data);
  }

  async bulkInsertIndexHistory(data: any[]): Promise<void> {
    if (data.length === 0) return;
    await this.db.insert(schema.index_history).values(data);
  }

  // Search Implementation

  async searchDailyValuations(startDate?: string, endDate?: string, clientName?: string): Promise<any[]> {
    const whereConditions: SQL[] = [];
    if (startDate) whereConditions.push(gte(schema.daily_valuations.valuationDate, startDate));
    if (endDate) whereConditions.push(lte(schema.daily_valuations.valuationDate, endDate));
    if (clientName) whereConditions.push(ilike(schema.daily_valuations.clientCode, `%${clientName}%`));

    return this.db.query.daily_valuations.findMany({
      where: and(...whereConditions),
      orderBy: (table, { desc }) => [desc(table.valuationDate)],
    });
  }

  async searchHoldings(startDate?: string, endDate?: string, clientName?: string): Promise<any[]> {
    const whereConditions: SQL[] = [];
    if (startDate) whereConditions.push(gte(schema.holdings.valuationDate, startDate));
    if (endDate) whereConditions.push(lte(schema.holdings.valuationDate, endDate));
    if (clientName) whereConditions.push(ilike(schema.holdings.clientCode, `%${clientName}%`));

    return this.db.query.holdings.findMany({
      where: and(...whereConditions),
    });
  }

  async searchMarketList(companyName?: string): Promise<any[]> {
    const whereConditions: SQL[] = [];
    if (companyName) whereConditions.push(ilike(schema.market_list.companyName, `%${companyName}%`));

    return this.db.query.market_list.findMany({
      where: and(...whereConditions),
    });
  }

  async searchTransactions(startDate?: string, endDate?: string, clientName?: string): Promise<any[]> {
    const whereConditions: SQL[] = [];
    if (startDate) whereConditions.push(gte(schema.transactions.orderDate, startDate));
    if (endDate) whereConditions.push(lte(schema.transactions.orderDate, endDate));
    if (clientName) whereConditions.push(ilike(schema.transactions.clientCode, `%${clientName}%`));

    return this.db.query.transactions.findMany({
      where: and(...whereConditions),
    });
  }

  async searchIndexHistory(startDate?: string, endDate?: string, schemeName?: string): Promise<any[]> {
    const whereConditions: SQL[] = [];
    if (startDate) whereConditions.push(gte(schema.index_history.valuationDate, startDate));
    if (endDate) whereConditions.push(lte(schema.index_history.valuationDate, endDate));
    if (schemeName) whereConditions.push(ilike(schema.index_history.schemeName, `%${schemeName}%`));

    return this.db.query.index_history.findMany({
      where: and(...whereConditions),
    });
  }
}