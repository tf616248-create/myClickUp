import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { userResponse, userData } from '../../models/user';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly tokenKey = 'auth_token';

  register(userData: userData): Observable<userResponse> {
    return this.http.post<userResponse>(
      `${environment.apiUrl}/auth/register`,
      userData
    );
  }

  login(userData: userData): Observable<userResponse> {
    return this.http.post<userResponse>(
      `${environment.apiUrl}/auth/login`,
      userData
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(redirectUrl = '/login'): void {
    this.clearToken();
    this.router.navigate([redirectUrl]);
  }
}
