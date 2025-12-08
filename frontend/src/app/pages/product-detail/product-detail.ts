import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { AuthService } from '../../auth.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
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
      },
      error: (err) => this.error = err?.error?.message || 'Erro ao carregar produto'
    });
  }

  agendar() {
    if (!this.product?.id) return;
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
    const list: string[] = [];
    if (p?.imageUrl) list.push(p.imageUrl);
    if (p?.galleryUrls) {
      const extra = String(p.galleryUrls)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => !!s);
      list.push(...extra);
    }
    list.push(...this.defaultSlides);
    const unique = Array.from(new Set(list.filter(Boolean)));
    return unique.length > 0 ? unique : ['https://via.placeholder.com/900x400?text=Brinquedo'];
  }
}
