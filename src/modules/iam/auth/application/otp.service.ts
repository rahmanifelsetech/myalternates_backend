import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async generateOtp(identifier: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(identifier, otp, 300 * 1000); // OTP is valid for 5 minutes (in milliseconds)
    return otp;
  }

  async verifyOtp(identifier: string, otp: string): Promise<boolean> {
    const storedOtp = await this.cacheManager.get(identifier);
    return storedOtp === otp;
  }
}