import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  products: any[] = [];
  cards: any[] = [];
  filteredCards: any[] = [];
  loadError = '';

  categories = [
    { name: 'Todos os Brinquedos', count: 12, active: true },
    { name: 'Brinquedos Aquaticos', count: 4, active: false },
    { name: 'Diversao para Todas as Idades', count: 3, active: false },
    { name: 'Cama Elastica', count: 2, active: false },
    { name: 'Jogos de Mesa', count: 2, active: false },
    { name: 'Linha Home', count: 1, active: false }
  ];

  slides = [
    {
      image: 'https://images.unsplash.com/photo-1504691342899-4d92b50853e1?auto=format&fit=crop&w=1400&q=60',
      badge: 'Aluguel de brinquedos',
      title1: 'Diversao garantida',
      title2: 'para sua festa!',
      subtitle: 'Brinquedos inflaveis e camas elasticas com qualidade premium.'
    },
    {
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60',
      badge: 'Seguranca e alegria',
      title1: 'Camas elasticas',
      title2: 'para todas as idades',
      subtitle: 'Montagem rapida e equipe especializada.'
    },
    {
      image: 'https://images.unsplash.com/photo-1582719478248-54e9f2af39d7?auto=format&fit=crop&w=1400&q=60',
      badge: 'Festas inesqueciveis',
      title1: 'Castelos e tobogas',
      title2: 'coloridos e seguros',
      subtitle: 'Escolha o tamanho ideal para seu espaco.'
    }
  ];

  currentSlide = 0;
  private slideTimer: any;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startSlider();
  }

  ngOnDestroy(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
  }

  loadProducts() {
    this.loadError = '';
    this.productService.listAll().subscribe({
      next: (data) => {
        this.products = data || [];
        this.cards = this.buildCards(this.products);
        this.filteredCards = this.cards;
      },
      error: (err) => {
        this.loadError = err?.error?.message || 'Erro ao carregar catalogo';
        this.cards = [];
        this.filteredCards = [];
      }
    });
  }

  selectProduct(p: any) {
    const productId = p?.productId || p?.id;
    if (!productId) {
      return;
    }
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.router.navigate(['/agendar', productId]);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(i: number) {
    this.currentSlide = i;
  }

  private startSlider() {
    this.slideTimer = setInterval(() => this.nextSlide(), 5000);
  }

  private buildCards(products: any[]): any[] {
    return (products || []).slice(0, 9).map((p) => ({
      name: p.name,
      category: p.category,
      productId: p.id,
      image: p.imageUrl || 'https://via.placeholder.com/400x250?text=Brinquedo',
      price: p.salePrice ?? 0,
      ageRange: p.ageRange || '',
      size: p.size || ''
    }));
  }

  filterByCategory(catName: string) {
    this.categories = this.categories.map(c => ({ ...c, active: c.name === catName }));
    if (catName === 'Todos os Brinquedos') {
      this.filteredCards = this.cards;
    } else {
      this.filteredCards = this.cards.filter(c => (c.category || '').toLowerCase().includes(catName.toLowerCase()));
    }
  }
}
