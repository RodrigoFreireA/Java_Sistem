import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div style="padding: 20px">
      <h1>ToyLog - Produtos com Baixo Estoque</h1>
      <div style="display:flex; gap:20px">
        <div style="flex:1">
          <div *ngFor="let p of products" style="border: 1px solid #ddd; padding: 12px; margin: 8px 0; border-radius: 8px; display:flex; gap:12px; align-items:center">
            <div style="flex:1">
              <div><strong>{{p.name}}</strong></div>
              <div>SKU: {{p.sku}} - R$ {{p.salePrice | number:'1.2-2'}}</div>
              <div *ngIf="p.stockQuantity < p.minStockLevel" style="color: white; background: #d32f2f; padding:4px 8px; border-radius:6px; font-weight:600; display:inline-block">Restam {{p.stockQuantity}}</div>
            </div>
            <button (click)="addToCart(p)" style="padding:8px 16px; background:#1976d2; color:#fff; border:none; border-radius:4px; cursor:pointer">Adicionar</button>
          </div>
        </div>
        <div style="position: fixed; right: 20px; top: 80px; width: 300px; background: #fff; border:1px solid #ddd; padding:12px; border-radius:8px">
          <h3>Carrinho</h3>
          <div *ngFor="let it of cart" style="padding:8px 0; border-bottom:1px solid #eee">
            {{it.name}} x {{it.quantity}}
          </div>
          <div *ngIf="cart.length==0" style="padding:8px 0; color:#999">Vazio</div>
          <div style="margin-top:12px; text-align:right">
            <button (click)="checkout()" [disabled]="cart.length==0" style="padding:6px 12px; background:#4caf50; color:#fff; border:none; border-radius:4px; cursor:pointer">Finalizar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './app.css',
  providers: [ProductService]
})
export class App implements OnInit {
  products: any[] = [];
  cart: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadLowStockProducts();
  }

  loadLowStockProducts() {
    this.productService.lowStock().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  addToCart(p: any) {
    const found = this.cart.find(c => c.id === p.id);
    if (found) {
      found.quantity++;
    } else {
      this.cart.push({ id: p.id, name: p.name, quantity: 1, price: p.salePrice });
    }
  }

  checkout() {
    if (this.cart.length === 0) return;
    const items = this.cart.map(it => ({ productId: it.id, quantity: it.quantity }));
    this.productService.createOrder({ items, username: 'vendedor' }).subscribe({
      next: (res) => {
        alert('Pedido criado com sucesso! ID: ' + res.id);
        this.cart = [];
      },
      error: (err) => alert('Erro ao criar pedido: ' + err.error.message)
    });
  }
}
