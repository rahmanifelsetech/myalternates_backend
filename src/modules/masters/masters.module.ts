import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';

// Controllers
import { AssetClassesController } from './api/asset-classes.controller';
import { BenchmarkIndicesController } from './api/benchmark-indices.controller';
import { FundManagersController } from './api/fund-managers.controller';
import { CategoriesController } from './api/categories.controller';

// Services
import { AssetClassesService } from './application/asset-classes.service';
import { BenchmarkIndicesService } from './application/benchmark-indices.service';
import { FundManagersService } from './application/fund-managers.service';
import { CategoriesService } from './application/categories.service';

// Repositories
import { AssetClassesRepository } from './infrastructure/asset-classes.repository';
import { BenchmarkIndicesRepository } from './infrastructure/benchmark-indices.repository';
import { FundManagersRepository } from './infrastructure/fund-managers.repository';
import { CategoriesRepository } from './infrastructure/categories.repository';

// Tokens
import {
  ASSET_CLASSES_REPOSITORY_TOKEN,
  BENCHMARK_INDICES_REPOSITORY_TOKEN,
  FUND_MANAGERS_REPOSITORY_TOKEN,
  CATEGORIES_REPOSITORY_TOKEN,
} from '../../infrastructure/database/constants';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AssetClassesController,
    BenchmarkIndicesController,
    FundManagersController,
    CategoriesController,
  ],
  providers: [
    AssetClassesService,
    BenchmarkIndicesService,
    FundManagersService,
    CategoriesService,
    {
      provide: ASSET_CLASSES_REPOSITORY_TOKEN,
      useClass: AssetClassesRepository,
    },
    {
      provide: BENCHMARK_INDICES_REPOSITORY_TOKEN,
      useClass: BenchmarkIndicesRepository,
    },
    {
      provide: FUND_MANAGERS_REPOSITORY_TOKEN,
      useClass: FundManagersRepository,
    },
    {
      provide: CATEGORIES_REPOSITORY_TOKEN,
      useClass: CategoriesRepository,
    },
  ],
  exports: [
    AssetClassesService,
    BenchmarkIndicesService,
    FundManagersService,
    CategoriesService,
  ],
})
export class MastersModule {}