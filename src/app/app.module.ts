import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard'
import { LoginComponent } from './login/login.component';
import { GridComponent } from './grid/grid.component';
import { JwtInterceptor } from './guards/httpInterceptor'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GridComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/index', 
        pathMatch: 'full'
      },
      {
        path: 'index',
        component: LoginComponent
      },
      {
        path: 'grid',
        component: GridComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
  {
    provide: AuthGuard,
    useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
