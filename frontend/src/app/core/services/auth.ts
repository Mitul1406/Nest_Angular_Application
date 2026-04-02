import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../constant/api.constants';
import { ApiService } from './api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService) {}

  register(data: any) {
    return this.api.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  login(data: any) {
    return this.api.post(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  verifyOtp(data: any) {
    return this.api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
  }

  refresh(token: string) {
    return this.api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken: token });
  }

  resendOtp(email:string){
    return this.api.post(API_ENDPOINTS.AUTH.RESEND,{email});
  }
}