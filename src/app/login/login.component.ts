import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Router } from '../../../node_modules/@angular/router';
import { LoginService } from '../shared/login.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  response;
  constructor(
    private loginService: LoginService,
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.createForms();
  }

  /**
   * Setup the form for user sign in
   */
  createForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      remember: [''],
    });
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
    });
  }

  onSignup() {
    const formValues = this.signupForm.value;
    this.loginService.postUser(formValues)
      .subscribe((res) => {
        this.response = res;
        alert(this.response.message);
        this.signupForm.reset();
      }, (err) => {
        alert(err.message);
        this.signupForm.reset();
      });
  }

  onLogin() {
    let data = this.loginForm.value;
    const { remember } = data;
    localStorage.setItem('rememberMe',remember);
    delete data.remember;
    this.loginService.authUser(data).subscribe((res:any) => {
      const { accessToken, refreshToken } = res.data;
      this.authService.setAccessToken(accessToken);
      this.authService.setRefreshToken(refreshToken);
      this.router.navigateByUrl('grid');
    }, (errRes) => {
      alert(errRes.error.message);
      this.loginForm.reset();
    });
  }
}
