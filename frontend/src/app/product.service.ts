import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiBase = environment.apiBase;
  private base = `${this.apiBase}/products`;

  constructor(private http: HttpClient) {}

  listAll(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  lowStock(): Observable<any[]> {
    return this.http.get<any[]>(this.base + '/low-stock');
  }

  createOrder(req: any): Observable<any> {
    return this.http.post(`${this.apiBase}/orders`, req);
  }

  createProduct(req: any): Observable<any> {
    return this.http.post(this.base, req);
  }
}
