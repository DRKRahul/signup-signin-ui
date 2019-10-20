import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class GridService {
  readonly baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) { }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }
  updateUserDetails(data){
    return this.http.put(`${this.baseUrl}/users/${data.id}`,data);
  }
}
