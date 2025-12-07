import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from './booking.service';
import { ProductService } from './product.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:1200px; margin:24px auto; padding:0 16px;">
      <h2>Admin - Brinquedos e Agendamentos</h2>

      <section style="margin-top:16px; display:grid; gap:16px; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));">
        <div style="border:1px solid #e0e0e0; border-radius:12px; padding:12px;">
          <h3 style="margin-bottom:8px;">Agendamentos</h3>
          <div *ngIf="bookingError" style="color:#d32f2f;">{{bookingError}}</div>
          <div *ngFor="let b of bookings" style="padding:8px 0; border-bottom:1px solid #eee;">
            <div><strong>{{b.productName}}</strong> - {{b.eventDate}}</div>
            <div style="color:#555;">{{b.customerName}} - {{b.phone}}</div>
            <div style="color:#777; font-size:12px;">{{b.status}}</div>
          </div>
          <div *ngIf="bookings.length === 0" style="color:#777;">Nenhum agendamento.</div>
        </div>

        <div style="border:1px solid #e0e0e0; border-radius:12px; padding:12px;">
          <h3 style="margin-bottom:8px;">Adicionar brinquedo</h3>
          <div *ngIf="productError" style="color:#d32f2f;">{{productError}}</div>
          <form (ngSubmit)="createProduct()" #prodForm="ngForm" style="display:grid; gap:8px;">
            <input name="name" [(ngModel)]="product.name" placeholder="Nome" required style="padding:8px; border:1px solid #ccc; border-radius:6px;" />
            <input name="sku" [(ngModel)]="product.sku" placeholder="SKU" required style="padding:8px; border:1px solid #ccc; border-radius:6px;" />
            <input name="category" [(ngModel)]="product.category" placeholder="Categoria" style="padding:8px; border:1px solid #ccc; border-radius:6px;" />
            <textarea name="description" [(ngModel)]="product.description" placeholder="Descrição" rows="2" style="padding:8px; border:1px solid #ccc; border-radius:6px;"></textarea>
            <input name="salePrice" [(ngModel)]="product.salePrice" type="number" step="0.01" placeholder="Preço locação" required style="padding:8px; border:1px solid #ccc; border-radius:6px;" />
            <input name="costPrice" [(ngModel)]="product.costPrice" type="number" step="0.01" placeholder="Custo" required style="padding:8px; border:1px solid #ccc; border-radius:6px;" />
            <input name="stockQuantity" [(ngModel)]="product.stockQuantity" type="number" placeholder="Quantidade" required style="padding:8px; border:1px solid #ccc; border-radius:6px;" />
            <input name="minStockLevel" [(ngModel)]="product.minStockLevel" type="number" placeholder="Estoque mínimo" required style="padding:8px; border:1px solid #ccc; border-radius:6px;" />
            <button type="submit" [disabled]="prodForm.invalid" style="padding:10px 12px; background:#1976d2; color:#fff; border:none; border-radius:8px; cursor:pointer;">Salvar</button>
          </form>
        </div>
      </section>
    </div>
  `
})
export class AdminPage implements OnInit {
  bookings: any[] = [];
  bookingError = '';
  productError = '';
  product: any = {
    name: '',
    sku: '',
    category: '',
    description: '',
    salePrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    minStockLevel: 0
  };

  constructor(private bookingService: BookingService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingError = '';
    this.bookingService.listAll().subscribe({
      next: (data) => this.bookings = data,
      error: (err) => this.bookingError = err?.error?.message || 'Erro ao carregar agendamentos'
    });
  }

  createProduct() {
    this.productError = '';
    this.productService.createProduct({
      ...this.product,
      costPrice: Number(this.product.costPrice),
      salePrice: Number(this.product.salePrice),
      stockQuantity: Number(this.product.stockQuantity),
      minStockLevel: Number(this.product.minStockLevel)
    }).subscribe({
      next: () => {
        this.product = { name: '', sku: '', category: '', description: '', salePrice: 0, costPrice: 0, stockQuantity: 0, minStockLevel: 0 };
      },
      error: (err) => this.productError = err?.error?.message || 'Erro ao salvar'
    });
  }
}
