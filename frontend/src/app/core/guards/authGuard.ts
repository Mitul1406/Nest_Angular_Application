import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private token: TokenService, private router: Router) {}

  canActivate(): boolean {
    const access = this.token.getAccessToken();
    const refresh = this.token.getRefreshToken();

    if (!access && !refresh) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}