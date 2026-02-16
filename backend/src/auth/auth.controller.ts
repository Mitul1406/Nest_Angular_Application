import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body);
  }

  @Post('verify-otp')
  verifyOtp(
    @Body() body: { email: string; otp: string },
  ) {
    return this.authService.verifyOtp(
      body.email,
      body.otp,
    );
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('logout')
  logout(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
}