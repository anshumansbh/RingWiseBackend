import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JwtConfig {
  constructor(private configService: ConfigService) {}

  getJwtConfig(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1h',
      },
    };
  }

  getJwtRefreshConfig(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-key',
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      },
    };
  }
}

