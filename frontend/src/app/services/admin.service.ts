import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  createCar(payload: Record<string, unknown>): Observable<unknown> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/cars`, payload).pipe(map((r) => r.data));
  }

  updateCar(id: number, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/cars/${id}`, payload).pipe(map((r) => r.data));
  }

  deleteCar(id: number): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/cars/${id}`).pipe(map((r) => r.data));
  }

  rentals(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/rentals`).pipe(map((r) => r.data));
  }

  confirmRental(id: number): Observable<unknown> {
    return this.http
      .patch<ApiResponse<unknown>>(`${environment.apiUrl}/rentals/${id}/status`, { status: 'confirmed' })
      .pipe(map((r) => r.data));
  }

  reclamations(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/reclamations`).pipe(map((r) => r.data));
  }

  resolveReclamation(id: number): Observable<unknown> {
    return this.http
      .patch<ApiResponse<unknown>>(`${environment.apiUrl}/reclamations/${id}/status`, { status: 'resolved' })
      .pipe(map((r) => r.data));
  }

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
}
