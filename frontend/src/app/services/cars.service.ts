import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Car } from '../models/types';

@Injectable({ providedIn: 'root' })
export class CarsService {
  constructor(private readonly http: HttpClient) {}

  list(filters: Record<string, string> = {}): Observable<Car[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http
      .get<ApiResponse<Car[]>>(`${environment.apiUrl}/cars`, { params })
      .pipe(map((res) => res.data));
  }

  detail(id: number): Observable<Car> {
    return this.http.get<ApiResponse<Car>>(`${environment.apiUrl}/cars/${id}`).pipe(map((res) => res.data));
  }

  checkAvailability(id: number, start: string, end: string): Observable<{ available: boolean }> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http
      .get<ApiResponse<{ available: boolean }>>(`${environment.apiUrl}/cars/${id}/availability`, { params })
      .pipe(map((res) => res.data));
  }

  create(payload: Record<string, unknown>): Observable<unknown> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/cars`, payload).pipe(map((r) => r.data));
  }

  update(id: number, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.put<ApiResponse<unknown>>(`${environment.apiUrl}/cars/${id}`, payload).pipe(map((r) => r.data));
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/cars/${id}`).pipe(map((r) => r.data));
  }
}
