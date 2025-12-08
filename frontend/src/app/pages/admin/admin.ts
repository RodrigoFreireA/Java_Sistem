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
  galleryItems: { name: string; data: string }[] = [];
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
  galleryError = '';

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
      minStockLevel: Number(this.product.minStockLevel),
      galleryUrls: JSON.stringify(this.galleryItems.map(i => i.data))
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
    this.galleryItems = this.parseGallery(p.galleryUrls);
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
    this.galleryItems = [];
  }

  async onGalleryFilesChange(event: any) {
    const files: FileList | null = event?.target?.files || null;
    if (!files) return;
    const available = 3 - this.galleryItems.length;
    if (available <= 0) return;
    const selected = Array.from(files).slice(0, available);
    try {
      const dataUrls = await Promise.all(
        selected.map(
          (file) =>
            new Promise<{ name: string; data: string }>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve({ name: file.name, data: reader.result as string });
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(file);
            })
        )
      );
      this.galleryError = '';
      this.galleryItems = [...this.galleryItems, ...dataUrls];
      this.product.galleryUrls = JSON.stringify(this.galleryItems.map(i => i.data));
    } catch (e) {
      this.galleryError = 'Falha ao ler imagens';
    } finally {
      if (event?.target) {
        event.target.value = '';
      }
    }
  }

  removeGalleryItem(index: number) {
    this.galleryItems = this.galleryItems.filter((_, i) => i !== index);
    this.product.galleryUrls = JSON.stringify(this.galleryItems.map(i => i.data));
  }

  private parseGallery(raw: any): { name: string; data: string }[] {
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return arr
          .map((d: any, idx: number) => {
            const data = d ? String(d) : '';
            if (!data) return null;
            return { name: `Imagem ${idx + 1}`, data };
          })
          .filter((v): v is { name: string; data: string } => !!v);
      }
    } catch (_) {
      // fallback: comma-separated string
      const parts = String(raw)
        .split(',')
        .map((s: string, idx: number) => {
          const data = s.trim();
          if (!data) return null;
          return { name: `Imagem ${idx + 1}`, data };
        })
        .filter((v): v is { name: string; data: string } => !!v);
      if (parts.length) return parts;
    }
    return [];
  }
}
