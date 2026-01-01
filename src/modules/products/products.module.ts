import { Module } from '@nestjs/common';
import { ProductsService } from './application/products.service';
import { ProductsRepository } from './infrastructure/products.repository';
import { PRODUCTS_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { ProductsController } from './api/products.controller';
import { DatabaseModule } from '@app/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCTS_REPOSITORY_TOKEN,
      useClass: ProductsRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
