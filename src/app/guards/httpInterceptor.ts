import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, empty, throwError } from 'rxjs';
import { catchError, mergeMap, tap, first } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'

import { AuthService } from '../shared/auth.service'

/**
 * Interceptor handling the addition of the JWT token to certain requests.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private protectedFalse = 'protectedFalse';
  private accessToken;
  private refToken;

  constructor(
    private authService: AuthService,
  ) { }
  
  /**
   * Intercept and token to http requests
   * @param request 
   * @param next 
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.accessToken = this.authService.getAccessToken();
    this.refToken = this.authService.getRefreshToken();
   
    if (request.headers.has(this.protectedFalse)) {
      const headers = request.headers.delete(this.protectedFalse);
      return next.handle(request.clone({ headers }));
    }

    if (this.isAccessTokenExpiredOrMissing()) {
      if (this.refToken) {
        return this.refreshToken()
          .pipe(
            mergeMap(() => this.makeAuthenticatedRequest(request, next))
          );
      }

      this.authService.logout();
      return empty(); 
    }

    // If token is valid, make the request
    return this.makeAuthenticatedRequest(request, next)
      .pipe(
        catchError(error => this.handleError(error, request, next))
      );
  }

  addAuthHeader(request): HttpRequest<any> {
    const authHeader = this.accessToken ? `Bearer ${this.accessToken}` : '';
    if (authHeader) {
      return request.clone({
        setHeaders: {
          Authorization: authHeader,
        },
      });
    }

    return request;
  }

  makeAuthenticatedRequest(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const authRequest = this.addAuthHeader(request);
    return next.handle(authRequest);
  }

  refreshToken(): Observable<any> {
    return this.authService.getNewAccessToken({
      accessToken: this.accessToken,
      refreshToken: this.refToken,
    })
      .pipe(
        tap((res: any) => {
          const { accessToken, refreshToken } = res.data;
          this.accessToken = accessToken;
          this.refToken = refreshToken;
        }),
        catchError((err) => {
          this.authService.logout();
          return empty();
        })
      );
  }

  handleError(error: any, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    console.log('JWT interceptor error: ', error);
    if (error.status === 401) {
      console.log('JWT interceptor: 401 error');
      return this.refreshToken()
        .pipe(
          mergeMap(() => this.makeAuthenticatedRequest(request, next))
        );
    }
    return throwError(error);
  }

  isAccessTokenExpiredOrMissing() {
    if (!this.accessToken) return true
    const helper = new JwtHelperService();
    return helper.isTokenExpired(this.accessToken);
  }
}
