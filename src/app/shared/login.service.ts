import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  readonly baseUrl = environment.baseUrl
  constructor(
    private http: HttpClient
  ) { }

  postUser(userdata) {
    return this.http.post(`${this.baseUrl}/users`, userdata, {
      headers: {
        protectedFalse: 'yes'
      }
    });
  }

  authUser(data) {
    return this.http.post(`${this.baseUrl}/users/login`, data, {
      headers: {
        protectedFalse: 'yes'
      }
    })
  }
}

