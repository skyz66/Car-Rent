import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, User } from '../models/types';

interface AuthPayload {
  user: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'car_rental_token';
  private readonly userKey = 'car_rental_user';

  constructor(private readonly http: HttpClient) {}

  register(payload: Record<string, unknown>): Observable<AuthPayload> {
    return this.http.post<ApiResponse<AuthPayload>>(`${environment.apiUrl}/auth/register`, payload).pipe(
      map((res) => res.data),
      tap((data) => this.setSession(data))
    );
  }

  login(email: string, password: string): Observable<AuthPayload> {
    return this.http.post<ApiResponse<AuthPayload>>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      map((res) => res.data),
      tap((data) => this.setSession(data))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  currentUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  private setSession(payload: AuthPayload): void {
    localStorage.setItem(this.tokenKey, payload.token);
    localStorage.setItem(this.userKey, JSON.stringify(payload.user));
  }
}
