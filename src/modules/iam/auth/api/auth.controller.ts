import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginClientDto } from './dto/login-client.dto';
import { RegisterStep1Dto, RegisterStep2Dto } from './dto/register-client.dto';
import { Public } from '@shared/decorators/public.decorator';
import { createSingleResponse } from '@app/shared/utils/response.helper';
import { ActiveUser } from '@shared/decorators/active-user.decorator';
import { UserWithRelations } from '@app/modules/iam/users/domain/users.repository.interface';
import { PublicUser } from '@app/shared/interfaces/auth.types';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SignInWithPasswordDto } from './dto/signin-with-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { SignInWithOtpDto } from './dto/signin-with-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginClientDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    const result = await this.authService.login(user, loginDto.rememberMe);
    return createSingleResponse(result, 'Login successful');
  }

  @Public()
  @Post('register/step1')
  async registerStep1(@Body() registerStep1Dto: RegisterStep1Dto) {
    const result = await this.authService.registerStep1(registerStep1Dto);
    return createSingleResponse(result, 'Registration step 1 successful');
  }

  @Public()
  @Post('register/step2')
  async registerStep2(@Body() registerStep2Dto: RegisterStep2Dto) {
    const result = await this.authService.registerStep2(registerStep2Dto);
    return createSingleResponse(result, 'Registration step 2 successful');
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return createSingleResponse({ success: true }, 'Logout successful');
  }

  @Get('me')
  getMe(@ActiveUser() user: UserWithRelations) {
    const userData: PublicUser = {
      id: user.id,
      email: user.email,
      name: (user.firstName || '') + ' ' + (user.lastName || ''),
      role: user.role?.name,
      appType: user.appType,
      permissions: user.role?.permissions.map((rp) => rp.permission.slug),
      phone: user.phone,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      requiresPasswordChange: user.requiresPasswordChange,
    };
    return createSingleResponse(userData, 'User details fetched successfully');
  }

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const result = await this.authService.sendOtp(sendOtpDto);
    return createSingleResponse(result, 'OTP sent successfully');
  }

  @Public()
  @Post('signin/password')
  @HttpCode(HttpStatus.OK)
  async signInWithPassword(@Body() signInWithPasswordDto: SignInWithPasswordDto) {
    const user = await this.authService.validateUser(
      signInWithPasswordDto.identifier,
      signInWithPasswordDto.password,
    );
    const result = await this.authService.login(user, signInWithPasswordDto.rememberMe);
    return createSingleResponse(result, 'Login successful');
  }

  @Public()
  @Post('signin/otp')
  @HttpCode(HttpStatus.OK)
  async signInWithOtp(@Body() signInWithOtpDto: SignInWithOtpDto) {
    const result = await this.authService.signInWithOtp(signInWithOtpDto);
    return createSingleResponse(result, 'Login successful');
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const result = await this.authService.verifyPasswordResetOtp(verifyOtpDto);
    return createSingleResponse(result, 'OTP verified successfully');
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return createSingleResponse(result, 'Password reset successfully');
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @ActiveUser() user: UserWithRelations,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const result = await this.authService.changePassword(user.id, changePasswordDto);
    return createSingleResponse(result, 'Password changed successfully');
  }
}
