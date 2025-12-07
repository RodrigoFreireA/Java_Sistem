import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  createBooking(req: any): Observable<any> {
    return this.http.post(`${this.apiBase}/bookings`, req);
  }

  listAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/bookings`);
  }
}
