import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import type { LoginResponse } from '@incidents/shared';

import { Public } from '@/common/decorators/public.decorator';

import { toLoginResponse } from './auth.mapper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: LoginDto): Promise<LoginResponse> {
    return toLoginResponse(await this.authService.login(credentials));
  }
}
