import { Controller, Post, UseInterceptors, UploadedFile, Get, Query, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BulkUploadService } from '../application/bulk-upload.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { DateRangeDto } from './dto/upload-data.dto';
import { Permissions } from '../../../shared/decorators/permissions.decorator';

@ApiTags('Data Upload')
@ApiBearerAuth()
@Controller('data-upload')
export class DataUploadController {
  constructor(private readonly bulkUploadService: BulkUploadService) {}

  @Post('daily-valuation')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Permissions('data_upload.daily_valuation.create')
  @ApiOperation({ summary: 'Upload Daily Valuations' })
  uploadDailyValuations(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return this.bulkUploadService.uploadDailyValuations(file);
  }

  @Post('holdings')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Permissions('data_upload.holding.create')
  @ApiOperation({ summary: 'Upload Holdings' })
  uploadHoldings(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return this.bulkUploadService.uploadHoldings(file);
  }

  @Post('market-list')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Permissions('data_upload.market_list.create')
  @ApiOperation({ summary: 'Upload Market List' })
  uploadMarketList(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return this.bulkUploadService.uploadMarketList(file);
  }

  @Post('transactions')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Permissions('data_upload.transaction.create')
  @ApiOperation({ summary: 'Upload Transactions' })
  uploadTransactions(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return this.bulkUploadService.uploadTransactions(file);
  }

  @Post('index-history')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Permissions('data_upload.index_history.create')
  @ApiOperation({ summary: 'Upload Index History' })
  uploadIndexHistory(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return this.bulkUploadService.uploadIndexHistory(file);
  }

  // Search Endpoints

  @Get('daily-valuation')
  @Permissions('data_upload.daily_valuation.read')
  @ApiOperation({ summary: 'Search Daily Valuations' })
  searchDailyValuations(@Query() query: DateRangeDto, @Query('clientName') clientName?: string) {
    return this.bulkUploadService.searchDailyValuations(query.startDate, query.endDate, clientName);
  }

  @Get('holdings')
  @Permissions('data_upload.holding.read')
  @ApiOperation({ summary: 'Search Holdings' })
  searchHoldings(@Query() query: DateRangeDto, @Query('clientName') clientName?: string) {
    return this.bulkUploadService.searchHoldings(query.startDate, query.endDate, clientName);
  }

  @Get('market-list')
  @Permissions('data_upload.market_list.read')
  @ApiOperation({ summary: 'Search Market List' })
  searchMarketList(@Query('companyName') companyName?: string) {
    return this.bulkUploadService.searchMarketList(companyName);
  }

  @Get('transactions')
  @Permissions('data_upload.transaction.read')
  @ApiOperation({ summary: 'Search Transactions' })
  searchTransactions(@Query() query: DateRangeDto, @Query('clientName') clientName?: string) {
    return this.bulkUploadService.searchTransactions(query.startDate, query.endDate, clientName);
  }

  @Get('index-history')
  @Permissions('data_upload.index_history.read')
  @ApiOperation({ summary: 'Search Index History' })
  searchIndexHistory(@Query() query: DateRangeDto, @Query('schemeName') schemeName?: string) {
    return this.bulkUploadService.searchIndexHistory(query.startDate, query.endDate, schemeName);
  }
}