import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpStatus,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateInternalUserDto, CreateUserDto } from './dto/create-user.dto';
import { Permissions } from '@shared/decorators/permissions.decorator';
import { PERMISSIONS } from '@app/shared/constants/permissions.constants';
import { FilterUsersQueryDto } from './dto/filter-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  createSingleResponse,
  createPaginatedResponse,
  createEmptyResponse,
} from '@shared/utils/response.helper';
import {
  SingleResponse,
  PaginatedResponse,
  EmptyResponse,
} from '@app/shared/interfaces/core/response.type';
import { UserWithRelations, User } from '../domain/users.repository.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions(PERMISSIONS.USERS.READ.slug)
  async findAll(
    @Query() filters: FilterUsersQueryDto,
  ): Promise<PaginatedResponse<UserWithRelations>> {
    const result = await this.usersService.findAll(filters);

    // Calculate totalPages and create metaData object compatible with PaginationMeta
    const totalPages = Math.ceil(result.total / result.limit);
    const metaData = {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: totalPages,
      hasNextPage: result.page < totalPages,
      hasPrevPage: result.page > 1,
    };

    return createPaginatedResponse(
      result.data,
      metaData,
      'Users retrieved successfully',
    );
  }

  @Get(':id')
  @Permissions(PERMISSIONS.USERS.READ.slug)
  async findOne(
    @Param('id') id: string,
  ): Promise<SingleResponse<Partial<UserWithRelations>>> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return createSingleResponse(user, 'User retrieved successfully');
  }

  @Post()
  @Permissions(PERMISSIONS.USERS.CREATE.slug)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SingleResponse<User>> {
    const user = await this.usersService.create(createUserDto);
    return createSingleResponse(user, 'User created successfully');
  }

  @Post('internal')
  @Permissions(PERMISSIONS.USERS.CREATE.slug)
  async createInternalUser(
    @Body() createUserDto: CreateInternalUserDto,
  ): Promise<SingleResponse<User>> {
    const user = await this.usersService.createInternalUser(createUserDto);
    return createSingleResponse(user, 'User created successfully');
  }

  @Put(':id')
  @Permissions(PERMISSIONS.USERS.UPDATE.slug)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SingleResponse<User>> {
    const user = await this.usersService.update(id, updateUserDto);
    return createSingleResponse(user, 'User updated successfully');
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.USERS.DELETE.slug)
  async remove(@Param('id') id: string): Promise<EmptyResponse> {
    await this.usersService.remove(id);
    return createEmptyResponse('User deleted successfully');
  }
}
