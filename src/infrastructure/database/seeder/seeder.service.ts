import { Injectable } from '@nestjs/common';
import { RolesService } from '@app/modules/iam/roles/application/roles.service';
import { UsersService } from '@app/modules/iam/users/application/users.service';
import { ProductsService } from '@app/modules/products/application/products.service';
import { PermissionsService } from '@app/modules/iam/permissions/application/permissions.service';
import { ROLES, ADMIN_USER, PRODUCTS } from './data';
import { PERMISSIONS } from '@app/shared/constants/permissions.constants';
import * as bcrypt from 'bcrypt';
import { generateNextCode } from '@shared/utils/series-code-generate';

@Injectable()
export class SeederService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async seed() {
    await this.seedRoles();
    await this.seedAdminUser();
    await this.seedProducts();
    await this.seedPermissions();
  }

  async seedRoles() {
    for (const role of ROLES) {
      const existingRole = await this.rolesService.findBySlug(role.slug);
      if (!existingRole) {
        await this.rolesService.create(role);
      }
    }
    console.log('Roles seeding completed.');
  }

  async seedPermissions() {
    const permissions = Object.values(PERMISSIONS).flatMap((group) => Object.values(group));
    for (const permission of permissions) {
      const existingPermission = await this.permissionsService.findBySlug(permission.slug);
      if (!existingPermission) {
        await this.permissionsService.create({ name: permission.name, slug: permission.slug, description: permission.description });
      }
    }
    console.log('Permissions seeding completed.');
  }

  async seedProducts() {
    for (const product of PRODUCTS) {
      const existingProduct = await this.productsService.findAll({ search: product.name, limit: 1, page: 1 });
      if (existingProduct.data.length === 0) {
        await this.productsService.create(product);
      }
    }
    console.log('Products seeding completed.');
  }

  async seedAdminUser() {
    const existingAdminByEmail = await this.usersService.findByEmail(ADMIN_USER.email);
    const existingAdminByUsername = await this.usersService.findByUsername(ADMIN_USER.username);
    if (!existingAdminByEmail && !existingAdminByUsername) {
      const adminRole = await this.rolesService.findBySlug('admin');
      if (adminRole) {
        const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);
        const lastUserResult = await this.usersService.findAll({ limit: 1, page: 1 });
        let userCode = lastUserResult.data.length > 0 && lastUserResult.data[0].userCode ? lastUserResult.data[0].userCode : 'USR-0000';
        userCode = generateNextCode({ lastCode: userCode, prefix: 'USR-' });
        await this.usersService.create({
          ...ADMIN_USER,
          password: hashedPassword,
          roleId: adminRole.id,
          userCode: userCode,
        });
      }
    }
  }
}
