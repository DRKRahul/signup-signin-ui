import {
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
  } from '@angular/router';
  import { Injectable } from '@angular/core';
  import { AuthService } from '../shared/auth.service';
  import { Observable, of as observableOf } from 'rxjs';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    private url: string;
    loggedIn: Observable<boolean>;

    constructor(
      private router: Router,
      private authService: AuthService,
    ) {
      this.loggedIn = observableOf(this.authService.getLoginState());
      this.loggedIn.subscribe(loginStatus => {
        if (!loginStatus) {
          this.router.navigateByUrl('/index')
          return false;
        }
      });
    }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      this.url = state.url;
      console.log("========",this.url);
      console.log("========",this.loggedIn);
      return this.loggedIn;
    }
  }
  