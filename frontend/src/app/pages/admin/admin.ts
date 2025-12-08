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
  editingId: string | null = null;
  editForm: any = { eventDate: '', status: 'PENDING', notes: '' };
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

  startEdit(booking: any) {
    this.bookingError = '';
    this.editingId = booking.id;
    this.editForm = {
      eventDate: booking.eventDate,
      status: booking.status,
      notes: booking.notes || ''
    };
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit() {
    if (!this.editingId) return;
    this.bookingError = '';
    this.bookingService.updateBooking(this.editingId, {
      eventDate: this.editForm.eventDate,
      status: this.editForm.status,
      notes: this.editForm.notes
    }).subscribe({
      next: () => {
        this.editingId = null;
        this.loadBookings();
      },
      error: (err) => this.bookingError = err?.error?.message || 'Erro ao atualizar agendamento'
    });
  }

  deleteBooking(id: string) {
    const confirmed = window.confirm('Deseja realmente excluir este agendamento?');
    if (!confirmed) return;
    this.bookingError = '';
    this.bookingService.deleteBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => this.bookingError = err?.error?.message || 'Erro ao excluir agendamento'
    });
  }
}
