import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.REFRESH_SECRET || 'REFRESH_SECRET',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}