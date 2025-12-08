import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { AuthService } from '../../auth.service';

const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="100%" height="100%" fill="%23121a2a"/><text x="50%" y="50%" fill="%23ffffff" font-family="Arial" font-size="18" dominant-baseline="middle" text-anchor="middle">Imagem%20indisponivel</text></svg>';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit {
  products: any[] = [];
  filtered: any[] = [];
  categories: { name: string; count: number; active: boolean }[] = [{ name: 'Todos os Brinquedos', count: 0, active: true }];
  error = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.error = '';
    this.productService.listAll().subscribe({
      next: (data) => {
        this.products = data || [];
        this.filtered = this.products;
        this.categories = this.buildCategories(this.products);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erro ao carregar brinquedos';
        this.products = [];
        this.filtered = [];
      }
    });
  }

  filterByCategory(cat: string) {
    this.categories = this.categories.map(c => ({ ...c, active: c.name === cat }));
    if (cat === 'Todos os Brinquedos') {
      this.filtered = this.products;
    } else {
      this.filtered = this.products.filter(p => (p.category || '').toLowerCase().includes(cat.toLowerCase()));
    }
  }

  goToDetail(p: any) {
    const productId = p?.id;
    if (!productId) return;
    this.router.navigate(['/produto', productId]);
  }

  private buildCategories(products: any[]) {
    const counts: Record<string, number> = {};
    (products || []).forEach(p => {
      const cat = (p.category || 'Outros').trim();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const list = Object.keys(counts).map(name => ({ name, count: counts[name], active: false }));
    const allCount = list.reduce((sum, c) => sum + c.count, 0);
    return [{ name: 'Todos os Brinquedos', count: allCount, active: true }, ...list];
  }

  primaryImage(p: any): string {
    if (p?.imageUrl) return p.imageUrl;
    const gallery = this.parseGallery(p?.galleryUrls);
    if (gallery.length > 0) return gallery[0];
    return FALLBACK_IMAGE;
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
}
