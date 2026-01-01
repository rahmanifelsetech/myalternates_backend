import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@app/modules/iam/users/application/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserWithRelations } from '@app/modules/iam/users/domain/users.repository.interface';
import { RegisterStep1Dto, RegisterStep2Dto } from '@app/modules/iam/auth/api/dto/register-client.dto';
import { RolesService } from '@app/modules/iam/roles/application/roles.service';
import { generateNextCode } from '@shared/utils/series-code-generate';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { AppTypes } from '@app/shared/interfaces/core/app.types';
import { NotificationsService } from '@app/modules/notifications/notifications.service';
import { EmailTemplateType } from '@app/modules/notifications/templates/email-templates.registry';
import { ChangePasswordDto } from '../api/dto/change-password.dto';
import { OtpService } from './otp.service';
import { SendOtpDto } from '../api/dto/send-otp.dto';
import { SignInWithOtpDto } from '../api/dto/signin-with-otp.dto';
import { VerifyOtpDto } from '../api/dto/verify-otp.dto';
import { ResetPasswordDto } from '../api/dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly otpService: OtpService,
  ) {}

  async findUserByIdentifier(identifier: string, includePassword = false): Promise<Partial<UserWithRelations> | undefined> {
    const columns = {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        requiresPasswordChange: true,
        appType: true,
        lastLoginAt: true,
        password: includePassword,
    };
    // This regex helps determine if the identifier is an email, phone, or PAN
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (emailRegex.test(identifier)) {
      return this.usersService.findByEmail(identifier, columns);
    } else if (phoneRegex.test(identifier)) {
      return this.usersService.findByPhone(identifier, columns);
    } else {
      return this.usersService.findByPan(identifier, columns);
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findUserByIdentifier(username, true);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result as UserWithRelations;
    }
    throw new BadRequestException('Invalid credentials');
  }

  async login(user: UserWithRelations, rememberMe = false) {
    const payload = { sub: user.id, appType: user.appType, role: user.roleId };

    const userData = {
      id: user.id,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
      role: user.role?.name,
      appType: user.appType,
      permissions: user.role?.permissions.map((rp) => rp.permission.slug),
      // avatar: user.avatar,
      phone: user.phone,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      requiresPasswordChange: user.requiresPasswordChange,
    }
    
    const expiresIn = rememberMe
      ? this.configService.get<StringValue>('jwt.rememberMeExpiresIn')
      : this.configService.get<StringValue>('jwt.expiresIn');


    return {
      user: userData,
      access_token: this.jwtService.sign(payload, { expiresIn }) 
    };
  }

  async registerStep1(registerStep1Dto: RegisterStep1Dto) {
    const existingUser = await this.usersService.findByEmail(registerStep1Dto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const role = await this.rolesService.findBySlug(registerStep1Dto.role);
    if (!role) {
      throw new BadRequestException('Invalid role selected');
    }

    const lastUserResult = await this.usersService.findAll({ page: 1, orderBy: 'createdAt', orderDirection: 'desc', limit: 1 });
    console.log('Last user result:', lastUserResult);
    let userCode = lastUserResult.data.length > 0 && lastUserResult.data[0].userCode ? lastUserResult.data[0].userCode : 'USR-0000';
    userCode = generateNextCode({ lastCode: userCode, prefix: 'USR-' });
    
    const newUser = await this.usersService.create({
      email: registerStep1Dto.email,
      phone: registerStep1Dto.phone,
      countryCode: registerStep1Dto.countryCode,
      firstName: registerStep1Dto.firstName,
      lastName: registerStep1Dto.lastName,
      roleId: role.id,
      userCode: userCode,
      appType: registerStep1Dto.role.toUpperCase() as AppTypes,
    });

    return { message: 'Step 1 complete. Please proceed to step 2 to set your credentials.', userId: newUser.id };
  }

  async registerStep2(registerStep2Dto: RegisterStep2Dto) {
    const user = await this.usersService.findById(registerStep2Dto.userId);
    if (!user) {
      throw new NotFoundException('User not found. Please complete step 1 first.');
    }

    const existingUsername = await this.usersService.findByUsername(registerStep2Dto.username);
    if (existingUsername) {
      throw new BadRequestException('Username is already taken.');
    }

    const hashedPassword = await bcrypt.hash(registerStep2Dto.password, 10);

    if (user.id) {
      await this.usersService.update(user.id, {
        username: registerStep2Dto.username,
        password: hashedPassword,
        terms: registerStep2Dto.terms,
      });
    }

    // Send welcome email
    if (user.email && user.firstName) {
      try {
        await this.notificationsService.sendEmailWithTemplate(
          user.email,
          EmailTemplateType.WELCOME,
          { name: `${user.firstName} ${user.lastName || ''}`.trim() },
        );
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't block registration if email fails
      }
    }

    return { message: 'Registration complete. You can now log in.' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password || !(await bcrypt.compare(changePasswordDto.oldPassword, user.password))) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    const updatedUser = await this.usersService.update(userId, {
      password: hashedPassword,
      requiresPasswordChange: false,
    });

    // Re-fetch user with relations to generate proper token payload and response
    const fullUser = await this.usersService.findById(userId);
    if (!fullUser) {
        throw new NotFoundException('User not found after password change');
    }

    return this.login(fullUser as UserWithRelations);
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const user = await this.findUserByIdentifier(sendOtpDto.identifier);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = await this.otpService.generateOtp(sendOtpDto.identifier);

    // Send OTP via email or SMS
    // Send welcome email
    console.log(`OTP for ${sendOtpDto.identifier}: ${otp}`);
    if (user.email && user.firstName) {
      try {
        await this.notificationsService.sendEmailWithTemplate(
          user.email,
          EmailTemplateType.OTP,
          { otp: otp },
        );
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't block registration if email fails
      }
      return { message: 'OTP sent successfully' };
    } else {
      throw new BadRequestException('User does not have a valid email to send OTP');
    }

  }

  async signInWithOtp(signInWithOtpDto: SignInWithOtpDto) {
    const isValid = await this.otpService.verifyOtp(
      signInWithOtpDto.identifier,
      signInWithOtpDto.otp,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.findUserByIdentifier(signInWithOtpDto.identifier);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.login(user as UserWithRelations, signInWithOtpDto.rememberMe);
  }

  async verifyPasswordResetOtp(verifyOtpDto: VerifyOtpDto) {
    const isValid = await this.otpService.verifyOtp(
      verifyOtpDto.identifier,
      verifyOtpDto.otp,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.findUserByIdentifier(verifyOtpDto.identifier);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a short-lived reset token
    const resetToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });

    return { reset_token: resetToken };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(resetPasswordDto.reset_token);
      const userId = payload.sub;

      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

      await this.usersService.update(userId, {
        password: hashedPassword,
        requiresPasswordChange: false,
      });

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}
