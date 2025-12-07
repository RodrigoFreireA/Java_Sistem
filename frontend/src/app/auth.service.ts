import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface LoginResponse {
  token: string;
  tokenType: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'toylog_token';
  private apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { username, password }).pipe(
      tap(res => this.setToken(res.token)),
      map(res => res.token)
    );
  }

  registerCustomer(payload: any): Observable<string> {
    return this.http.post<LoginResponse>(`${this.apiBase}/customers/register`, payload).pipe(
      tap(res => this.setToken(res.token)),
      map(res => res.token)
    );
  }

  loadProfile(): Observable<any> {
    return this.http.get(`${this.apiBase}/customers/me`).pipe(
      tap(profile => localStorage.setItem('toylog_profile', JSON.stringify(profile)))
    );
  }

  updateProfile(payload: any): Observable<any> {
    return this.http.put(`${this.apiBase}/customers/me`, payload).pipe(
      tap(profile => localStorage.setItem('toylog_profile', JSON.stringify(profile)))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('toylog_profile');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles: string[] = payload.roles || [];
      if (roles.includes('ROLE_ADMIN')) return 'ADMIN';
      if (roles.includes('ROLE_CUSTOMER')) return 'CUSTOMER';
      return null;
    } catch {
      return null;
    }
  }

  getCachedProfile(): any | null {
    const raw = localStorage.getItem('toylog_profile');
    return raw ? JSON.parse(raw) : null;
  }
}
