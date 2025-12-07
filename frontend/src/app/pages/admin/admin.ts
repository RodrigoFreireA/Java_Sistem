import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../booking.service';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  bookings: any[] = [];
  bookingError = '';
  productError = '';
  productLoadError = '';
  products: any[] = [];
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
    this.loadProducts();
  }

  loadBookings() {
    this.bookingError = '';
    this.bookingService.listAll().subscribe({
      next: (data) => this.bookings = data,
      error: (err) => this.bookingError = err?.error?.message || 'Erro ao carregar agendamentos'
    });
  }

  loadProducts() {
    this.productLoadError = '';
    this.productService.listAll().subscribe({
      next: (data) => this.products = data || [],
      error: (err) => this.productLoadError = err?.error?.message || 'Erro ao carregar brinquedos'
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
        this.loadProducts();
      },
      error: (err) => this.productError = err?.error?.message || 'Erro ao salvar'
    });
  }
}
