import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_CONFIG } from '../config/api-endpoints';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  username: string;
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${API_CONFIG.baseUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          localStorage.setItem(this.TOKEN_KEY, res.data.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  verifyToken() {
    if (!this.hasToken()) return;
    this.http.post(`${API_CONFIG.baseUrl}/auth/verify`, {}).subscribe({
      error: () => this.logout() // Invalid token
    });
  }
}
