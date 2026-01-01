import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/auth.service';
import { JwtStrategy } from './application/jwt.strategy';
import { AuthController } from './api/auth.controller';
import { RolesModule } from '../roles/roles.module';
import { NotificationsModule } from '@app/modules/notifications/notifications.module';
import { CacheModule } from '@nestjs/cache-manager';
import { OtpService } from './application/otp.service';
import { EmailService } from '@app/modules/notifications/providers/email.service';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    NotificationsModule,
    PassportModule,
    CacheModule.register(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    OtpService
  ],
  exports: [AuthService],
})
export class AuthModule {}
