import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Shared
export const DateRangeDtoSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export class DateRangeDto extends createZodDto(DateRangeDtoSchema) {}

// Daily Valuation
export const UploadDailyValuationSchema = z.object({
  amcClientCode: z.string().min(1),
  valuationDate: z.string(), // YYYY-MM-DD
  currentValuationAmount: z.number(),
});
export class UploadDailyValuationDto extends createZodDto(UploadDailyValuationSchema) {}

// Holdings
export const UploadHoldingSchema = z.object({
  amcClientCode: z.string().min(1),
  isinCode: z.string().optional(),
  valuationDate: z.string(),
  securityType: z.string().optional(),
  portfolioWeightage: z.number().optional(),
  quantity: z.number().optional(),
  averagePrice: z.number().optional(),
  marketPrice: z.number().optional(),
  currentValue: z.number().optional(),
});
export class UploadHoldingDto extends createZodDto(UploadHoldingSchema) {}

// Market List
export const UploadMarketListSchema = z.object({
  companyName: z.string().min(1),
  isinCode: z.string().min(1),
  categorization: z.string().optional(),
  sector: z.string().optional(),
  asOnDate: z.string().optional(),
});
export class UploadMarketListDto extends createZodDto(UploadMarketListSchema) {}

// Transactions
export const UploadTransactionSchema = z.object({
  amcClientCode: z.string().min(1),
  capitalCommitment: z.number().optional(),
  capitalCalled: z.number().optional(),
  orderDate: z.string(),
  valuationDate: z.string().optional(),
  transactionType: z.string().min(1),
  amount: z.number(),
  remarks: z.string().optional(),
});
export class UploadTransactionDto extends createZodDto(UploadTransactionSchema) {}

// Index History
export const UploadIndexHistorySchema = z.object({
  valuationDate: z.string(),
  schemeCode: z.string().optional(),
  schemeName: z.string().optional(),
  openValue: z.number().optional(),
  highValue: z.number().optional(),
  lowValue: z.number().optional(),
  closeValue: z.number().optional(),
});
export class UploadIndexHistoryDto extends createZodDto(UploadIndexHistorySchema) {}