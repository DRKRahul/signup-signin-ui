import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  readonly baseUrl = environment.baseUrl
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  getLoginState() {
    const rememberMe = localStorage.getItem('rememberMe');
    let access;
    let refresh;
    if(rememberMe){
      access = localStorage.getItem('access');
      refresh = localStorage.getItem('refresh');
    } else{
      access = sessionStorage.getItem('access');
      refresh = sessionStorage.getItem('refresh');
    }
   
    if (access && refresh) {
      return true;
    }
    return false;
  }

  logout() {
    const rememberMe = localStorage.getItem('rememberMe');
    if(rememberMe){
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    } else{
      sessionStorage.removeItem('access');
      sessionStorage.removeItem('refresh');
    }
    localStorage.removeItem('rememberMe');
    this.router.navigateByUrl('/index');
  }

  getNewAccessToken(data) {
    return this.http.post(`${this.baseUrl}/users/token`, data, {
      headers: {
        protectedFalse: 'yes'
      }
    })
      .pipe(tap((res: any) => {
        const { accessToken, refreshToken } = res.data;
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
      }));
  }

  setAccessToken(token) {
    const rememberMe = localStorage.getItem('rememberMe');
    if(rememberMe)
    {
      localStorage.setItem('access', token);
    } else{
      sessionStorage.setItem('access', token);
    }
    return true;
  }

  setRefreshToken(token) {
    const rememberMe = localStorage.getItem('rememberMe');
    if(rememberMe)
    {
      localStorage.setItem('refresh', token);
    } else{
      sessionStorage.setItem('refresh', token);
    }
    return true;
  }

  getAccessToken() {
    const rememberMe = localStorage.getItem('rememberMe');
    if(rememberMe)
    {
      return localStorage.getItem('access');
    } else{
      return sessionStorage.getItem('access');
    }
  }

  getRefreshToken() {
    const rememberMe = localStorage.getItem('rememberMe');
    if(rememberMe)
    {
      return localStorage.getItem('refresh');
    } else{
      return sessionStorage.getItem('refresh');
    }
  }
}

