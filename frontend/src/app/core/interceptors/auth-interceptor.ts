import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, switchMap, filter, take } from "rxjs/operators";
import { TokenService } from "../services/token";
import { AuthService } from "../services/auth";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // ✅ DO NOT intercept refresh request
    if (req.url.includes('/auth/refresh')) {
      return next.handle(req);
    }

    const access = this.tokenService.getAccessToken();

    if (access) {
      req = this.addToken(req, access);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {

      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();

      if (!refreshToken) {
        this.logout();
        return throwError(() => new Error("No refresh token"));
      }

      return this.authService.refresh(refreshToken).pipe(

        switchMap((res: any) => {

          if (!res.success) {
            throw new Error(res.message);
          }

          const newAccessToken = res.data.accessToken;

          this.tokenService.setAccessToken(newAccessToken);

          this.isRefreshing = false;
          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(this.addToken(request, newAccessToken));
        }),

        catchError((err) => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token =>
        next.handle(this.addToken(request, token!))
      )
    );
  }

  private logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}