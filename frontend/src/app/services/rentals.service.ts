import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Rental } from '../models/types';

@Injectable({ providedIn: 'root' })
export class RentalsService {
  constructor(private readonly http: HttpClient) {}

  create(payload: { car_id: number; start_date: string; end_date: string }): Observable<unknown> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/rentals`, payload).pipe(map((r) => r.data));
  }

  my(): Observable<Rental[]> {
    return this.http.get<ApiResponse<Rental[]>>(`${environment.apiUrl}/rentals/my`).pipe(map((r) => r.data));
  }

  list(): Observable<any[]> {
    return this.my().pipe(
      map((rows: any[]) =>
        rows.map((r) => ({
          ...r,
          car: r.car ?? { brand: r.brand, model: r.model }
        }))
      )
    );
  }

  all(): Observable<Rental[]> {
    return this.http.get<ApiResponse<Rental[]>>(`${environment.apiUrl}/rentals`).pipe(map((r) => r.data));
  }

  updateStatus(id: number, status: string): Observable<unknown> {
    return this.http
      .patch<ApiResponse<unknown>>(`${environment.apiUrl}/rentals/${id}/status`, { status })
      .pipe(map((r) => r.data));
  }

  cancel(id: number): Observable<unknown> {
    return this.http.patch<ApiResponse<unknown>>(`${environment.apiUrl}/rentals/${id}/cancel`, {}).pipe(map((r) => r.data));
  }
}
