import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY_TOKEN } from '@app/infrastructure/database/constants';
import { IUsersRepository, NewUser, UpdateUser } from '../domain/users.repository.interface';
import { generateStrongPassword } from '@app/shared/utils/password.utils';
import * as bcrypt from 'bcrypt';
import { NotificationsService } from '@app/modules/notifications/notifications.service';
import { EmailTemplateType } from '@app/modules/notifications/templates/email-templates.registry';
import { CreateInternalUserDto } from '../api/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN) // Injects the abstract contract
    private readonly usersRepository: IUsersRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(user: NewUser) {
    return this.usersRepository.create(user);
  }

  async createInternalUser(user: CreateInternalUserDto) {

    if(await this.usersRepository.findByEmail(user.email)) {
      throw new Error('User with this email already exists');
    }

    if(await this.usersRepository.findByUsername(user.username)) {
      throw new Error('User with this username already exists');
    }
    
    const password = generateStrongPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.create({
      ...user,
      appType: 'ADMIN',
      password: hashedPassword,
      requiresPasswordChange: true,
    });

    // Send email with credentials
    if (newUser.email) {
      try {
        await this.notificationsService.sendEmailWithTemplate(
          newUser.email,
          EmailTemplateType.INTERNAL_WELCOME,
          {
            name: `${newUser.firstName} ${newUser.lastName || ''}`.trim(),
            email: newUser.email,
            password: password,
          },
        );
      } catch (error) {
        console.error('Failed to send internal welcome email:', error);
      }
    }

    return newUser;
  }

  async update(id: string, user: UpdateUser) {
    return this.usersRepository.update(id, user);
  }

  async findByEmail(email: string, columns?: Record<string, boolean>) {
    return this.usersRepository.findByEmail(email, columns);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findByUsername(username);
  }

  async findByPhone(phone: string, columns?: Record<string, boolean>) {
    return this.usersRepository.findByPhone(phone, columns);
  }

  async findByPan(pan: string, columns?: Record<string, boolean>) {
    return this.usersRepository.findByPan(pan, columns);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async findAll(params: {
    limit?: number;
    page?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    search?: string;
    role?: string;
    appType?: string;
  }) {
    return this.usersRepository.findAll(params);
  }

  async remove(id: string) {
    return this.usersRepository.remove(id);
  }
}
