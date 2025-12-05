import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = '/api/products';

  constructor(private http: HttpClient) {}

  listAll(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  lowStock(): Observable<any[]> {
    return this.http.get<any[]>(this.base + '/low-stock');
  }

  createOrder(req: any): Observable<any> {
    return this.http.post('/api/orders', req);
  }
}
