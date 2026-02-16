import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {}

  async register(body: {
    email: string;
    password: string;
  }) {
    const exist = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (exist)
      throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(body.password, 10);

    const otp = this.generateOtp();
    const otpExpiry = this.generateOtpExpiry();

    const user = this.userRepo.create({
      email: body.email,
      password: hashed,
      otp,
      otpExpiry,
    });

    this.mail.sendOtpEmail(body.email,otp);

    await this.userRepo.save(user);

    return { message: 'OTP sent to email' };
  }

  async verifyOtp(email: string, otp: string) {
  const user = await this.userRepo.findOne({
    where: { email },
  });

  if (!user)
    throw new BadRequestException('User not found');

  if (!user.otp || user.otp !== otp)
    throw new BadRequestException('Invalid OTP');

  if (!user.otpExpiry || new Date() > user.otpExpiry)
    throw new BadRequestException('OTP expired');

  user.otp = null;
  user.otpExpiry = null;

  await this.userRepo.save(user);

  return this.generateTokens(user);
}

  async login(body: {
    email: string;
    password: string;
  }) {
    const user = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!match)
      throw new UnauthorizedException('Invalid credentials');

    const otp = this.generateOtp();
    const otpExpiry = this.generateOtpExpiry();

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await this.userRepo.save(user);

    return { message: 'Login OTP sent' };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('REFRESH_SECRET'),
      });

      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
      });

      if (!user)
        throw new UnauthorizedException('Invalid token');

      const isMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isMatch)
        throw new UnauthorizedException('Invalid token');

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, role: user.role },
        {
          secret: this.config.get('ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );

      return {
        message: 'Token refreshed',
        data: { accessToken: newAccessToken },
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefresh;
    await this.userRepo.save(user);

    return {
      message: 'Authentication successful',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  async logout(userId: number) {
  await this.userRepo.update(userId, {
    refreshToken: null,
  });

  return { message: 'Logged out successfully' };
}

  private generateOtp(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }

  private generateOtpExpiry(): Date {
  const expiry = new Date();
  const minutes = Number(process.env.OTP_EXPIRE_MINUTES) || 5;
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
}
}