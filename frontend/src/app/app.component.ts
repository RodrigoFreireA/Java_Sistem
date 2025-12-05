import { Component } from '@angular/core';
import { ProductService } from './product.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>ToyLog - Produtos</h1>
    <div style="display:flex; gap:16px">
      <div style="flex:1">
        <div *ngFor="let p of products" class="product-card">
          <div style="flex:1">
            <div><strong>{{p.name}}</strong></div>
            <div>SKU: {{p.sku}} - R$ {{p.salePrice}}</div>
            <div *ngIf="p.stockQuantity < p.minStockLevel" class="low-stock">Restam {{p.stockQuantity}}</div>
          </div>
          <div>
            <button (click)="addToCart(p)">Adicionar</button>
          </div>
        </div>
      </div>
      <div class="cart">
        <h3>Carrinho</h3>
        <div *ngFor="let it of cart">
          {{it.name}} x{{it.quantity}}
        </div>
        <div *ngIf="cart.length==0">Vazio</div>
      </div>
    </div>
  `,
  standalone: true,
  providers: [ProductService]
})
export class AppComponent {
  products: any[] = [];
  cart: any[] = [];

  constructor(private productService: ProductService) {
    this.load();
  }

  load() {
    this.productService.listAll().subscribe(res => this.products = res);
  }

  addToCart(p: any) {
    const found = this.cart.find(c => c.id === p.id);
    if (found) { found.quantity++; } else { this.cart.push({ id: p.id, name: p.name, quantity: 1 }); }
  }
}
