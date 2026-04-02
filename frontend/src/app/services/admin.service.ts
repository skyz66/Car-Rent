import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  topRented(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(`${environment.apiUrl}/admin/dashboard/top-rented`)
      .pipe(map((r) => r.data));
  }

  summary(): Observable<{ total_rentals: number; ongoing_rentals: number; revenue: number }> {
    return this.http
      .get<ApiResponse<{ total_rentals: number; ongoing_rentals: number; revenue: number }>>(
        `${environment.apiUrl}/admin/dashboard/summary`
      )
      .pipe(map((r) => r.data));
  }

  rentalsByDay(): Observable<Array<{ day: string; count: number }>> {
    return this.http
      .get<ApiResponse<Array<{ day: string; count: number }>>>(
        `${environment.apiUrl}/admin/dashboard/rentals-by-day`
      )
      .pipe(map((r) => r.data));
  }

  users(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/admin/users`).pipe(map((r) => r.data));
  }

  createUser(payload: Record<string, unknown>): Observable<unknown> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/admin/users`, payload).pipe(map((r) => r.data));
  }

  updateUser(id: number, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/admin/users/${id}`, payload).pipe(map((r) => r.data));
  }

  deleteUser(id: number): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/admin/users/${id}`).pipe(map((r) => r.data));
  }
}
