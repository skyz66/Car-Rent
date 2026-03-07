import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/types';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  constructor(private readonly http: HttpClient) {}

  generateContract(rentalId: number): Observable<unknown> {
    return this.http
      .post<ApiResponse<unknown>>(`${environment.apiUrl}/rentals/${rentalId}/documents/contract`, {})
      .pipe(map((r) => r.data));
  }

  generateInvoice(rentalId: number): Observable<unknown> {
    return this.http
      .post<ApiResponse<unknown>>(`${environment.apiUrl}/rentals/${rentalId}/documents/invoice`, {})
      .pipe(map((r) => r.data));
  }

  downloadUrl(docId: number): string {
    return `${environment.apiUrl}/documents/${docId}/download`;
  }
}
