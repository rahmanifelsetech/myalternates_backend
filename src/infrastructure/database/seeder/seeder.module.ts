import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config/config.module';
import { SeederService } from './seeder.service';
import { DatabaseModule } from '@app/infrastructure/database/database.module';
import { UsersModule } from '@app/modules/iam/users/users.module';
import { RolesModule } from '@app/modules/iam/roles/roles.module';
import { ProductsModule } from '@app/modules/products/products.module';
import { PermissionsModule } from '@app/modules/iam/permissions/permissions.module';

@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule, RolesModule, ProductsModule, PermissionsModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
