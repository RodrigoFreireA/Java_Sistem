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
  productLoading = false;
  products: any[] = [];
  editingId: string | null = null;
  editForm: any = { eventDate: '', status: 'PENDING', notes: '' };
  editingProductId: string | null = null;
  product: any = {
    name: '',
    sku: '',
    category: '',
    description: '',
    salePrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    minStockLevel: 0,
    size: '',
    ageRange: '',
    galleryUrls: ''
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
    this.productLoading = true;
    this.productService.listAll().subscribe({
      next: (data) => {
        this.products = data || [];
        this.productLoading = false;
      },
      error: (err) => {
        this.productLoadError = err?.error?.message || 'Erro ao carregar brinquedos';
        this.productLoading = false;
      }
    });
  }

  createProduct() {
    this.productError = '';
    const payload = {
      ...this.product,
      costPrice: Number(this.product.costPrice),
      salePrice: Number(this.product.salePrice),
      stockQuantity: Number(this.product.stockQuantity),
      minStockLevel: Number(this.product.minStockLevel)
    };

    const obs = this.editingProductId
      ? this.productService.updateProduct(this.editingProductId, payload)
      : this.productService.createProduct(payload);

    obs.subscribe({
      next: () => {
        this.resetProductForm();
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

  editProduct(p: any) {
    this.productError = '';
    this.editingProductId = p.id || p.productId;
    this.product = {
      name: p.name,
      sku: p.sku,
      category: p.category,
      description: p.description,
      salePrice: p.salePrice,
      costPrice: p.costPrice,
      stockQuantity: p.stockQuantity,
      minStockLevel: p.minStockLevel,
      size: p.size,
      ageRange: p.ageRange,
      galleryUrls: p.galleryUrls
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelProductEdit() {
    this.resetProductForm();
  }

  deleteProduct(id: string) {
    const confirmed = window.confirm('Deseja excluir este brinquedo?');
    if (!confirmed) return;
    this.productError = '';
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        if (this.editingProductId === id) {
          this.resetProductForm();
        }
        this.loadProducts();
      },
      error: (err) => this.productError = err?.error?.message || 'Erro ao excluir'
    });
  }

  private resetProductForm() {
    this.editingProductId = null;
    this.product = { name: '', sku: '', category: '', description: '', salePrice: 0, costPrice: 0, stockQuantity: 0, minStockLevel: 0, size: '', ageRange: '', galleryUrls: '' };
  }
}
