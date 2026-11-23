import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import type { ThrottlerModuleOptions } from '@nestjs/throttler';

import { CapabilityGuard } from '@/common/guards/capability.guard';
import { AppConfig } from '@/config/app-config';
import { UsersModule } from '@/modules/users/users.module';

import { AccessTokenService } from './access-token.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

const JWT_ALGORITHM = 'HS256';
const LOGIN_THROTTLE_WINDOW_MS = 60_000;

function createJwtOptions(config: AppConfig): JwtModuleOptions {
  return {
    secret: config.jwt.secret,
    signOptions: { algorithm: JWT_ALGORITHM, expiresIn: config.jwt.expiresInSeconds },
    verifyOptions: { algorithms: [JWT_ALGORITHM] },
  };
}

function createThrottlerOptions(config: AppConfig): ThrottlerModuleOptions {
  return {
    throttlers: [{ ttl: LOGIN_THROTTLE_WINDOW_MS, limit: config.loginMaxAttemptsPerMinute }],
  };
}

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({ inject: [AppConfig], useFactory: createJwtOptions }),
    ThrottlerModule.forRootAsync({ inject: [AppConfig], useFactory: createThrottlerOptions }),
  ],
  controllers: [AuthController],
  providers: [
    AccessTokenService,
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: CapabilityGuard },
  ],
})
export class AuthModule {}
