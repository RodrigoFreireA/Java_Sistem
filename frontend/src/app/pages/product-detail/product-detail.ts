import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { AuthService } from '../../auth.service';
import { BookingService } from '../../booking.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  product: any = null;
  error = '';
  slides: string[] = [];
  currentSlide = 0;
  // use relative path served from public/images
  private defaultSlides = ['images/carousel1.jpg', 'images/carousel2.jpg', 'images/carousel3.jpg'];
  alreadyBooked = false;
  bookedDate: string | null = null;
  outOfStock = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Produto inválido';
      return;
    }
    this.load(id);
  }

  load(id: string) {
    this.error = '';
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.slides = this.buildSlides(p);
        this.currentSlide = 0;
        this.outOfStock = (p.stockQuantity ?? 0) <= 0;
        this.checkUserBooking(p.id);
      },
      error: (err) => this.error = err?.error?.message || 'Erro ao carregar produto'
    });
  }

  agendar() {
    if (!this.product?.id) return;
    if (this.alreadyBooked || this.outOfStock) return;
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.router.navigate(['/agendar', this.product.id]);
  }

  nextSlide() {
    if (this.slides.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    if (this.slides.length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(i: number) {
    this.currentSlide = i;
  }

  private buildSlides(p: any): string[] {
    const gallery = this.parseGallery(p?.galleryUrls);
    const list: string[] = [];
    if (gallery.length > 0) {
      list.push(...gallery);
    } else if (p?.imageUrl) {
      list.push(p.imageUrl);
    }
    const unique = Array.from(new Set(list.filter(Boolean)));
    if (unique.length > 0) return unique;
    return [this.defaultSlides[0]];
  }

  private parseGallery(raw: any): string[] {
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return arr.map((v: any) => String(v)).filter((v) => !!v);
      }
    } catch {}
    return String(raw)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  private checkUserBooking(productId: string) {
    this.alreadyBooked = false;
    this.bookedDate = null;
    if (!this.authService.isLoggedIn()) return;
    this.bookingService.listMine().subscribe({
      next: (list) => {
        const active = (list || []).find((b: any) =>
          b.productId === productId && b.status === 'PENDING'
        );
        if (active) {
          this.alreadyBooked = true;
          this.bookedDate = active.eventDate;
        }
      },
      error: () => {}
    });
  }
}
