import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter:any;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: Number(this.config.get('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: `"Your App" <${this.config.get('MAIL_USER')}>`,
      to,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in ${this.config.get('OTP_EXPIRE_MINUTES') || 5} minutes.</p>
        </div>
      `,
    });
  }
}