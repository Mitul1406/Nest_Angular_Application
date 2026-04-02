import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TokenService {

  setTokens(access: string, refresh: string) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setAccessToken(token: string) {
  localStorage.setItem('accessToken', token);
}

  clear() {
    localStorage.clear();
  }

  getRole() {
    const token = this.getAccessToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }
}