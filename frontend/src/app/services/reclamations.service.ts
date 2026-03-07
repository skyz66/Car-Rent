import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ReclamationsService {
  constructor(private readonly http: HttpClient) {}

  create(payload: Record<string, unknown>): Observable<unknown> {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/reclamations`, payload).pipe(map((r) => r.data));
  }

  my(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/reclamations/my`).pipe(map((r) => r.data));
  }

  list(): Observable<any[]> {
    return this.my();
  }

  all(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/reclamations`).pipe(map((r) => r.data));
  }

  updateStatus(id: number, status: string): Observable<unknown> {
    return this.http
      .patch<ApiResponse<unknown>>(`${environment.apiUrl}/reclamations/${id}/status`, { status })
      .pipe(map((r) => r.data));
  }
}
