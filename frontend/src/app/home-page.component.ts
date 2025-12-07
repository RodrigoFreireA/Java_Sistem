import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { BookingService } from './booking.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div style="background:#0e1117; min-height:100vh; color:#f5f7fa;">
      <header style="background:#0c0f16; border-bottom:1px solid #151b27;">
        <div style="max-width:1300px; margin:0 auto; padding:12px 20px; display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#00d2ff,#3b82f6); display:flex; align-items:center; justify-content:center; font-weight:800; color:#0e1117;">PI</div>
            <div>
              <div style="font-weight:800;">PlayMove</div>
              <div style="font-size:12px; color:#b8c1d4;">Aluguel de Brinquedos</div>
            </div>
          </div>
          <nav style="display:flex; gap:16px; align-items:center; font-weight:700;">
            <a routerLink="/" style="color:#00d2ff; text-decoration:none;">Home</a>
            <a href="#catalogo" style="color:#e7ecf3; text-decoration:none;">Brinquedos</a>
            <a href="#agendar" style="color:#e7ecf3; text-decoration:none;">Agendar</a>
            <a href="#contato" style="color:#e7ecf3; text-decoration:none;">Contato</a>
          </nav>
          <div style="display:flex; gap:10px;">
            <button routerLink="/login" style="padding:8px 12px; background:#1d2433; color:#f5f7fa; border:1px solid #1f2a3d; border-radius:10px; cursor:pointer;">Login</button>
            <button routerLink="/register" style="padding:8px 12px; background:#00d2ff; color:#0e1117; border:none; border-radius:10px; cursor:pointer; font-weight:700;">Cadastre-se</button>
          </div>
        </div>
      </header>

      <section style="position:relative; overflow:hidden; background:#0c0f16;">
        <div style="max-width:1300px; margin:0 auto; padding:32px 20px 16px;">
          <div style="position:relative; border-radius:16px; overflow:hidden; height:360px; background:#111623;">
            <img [src]="slides[currentSlide].image" alt="slide" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.55);" />
            <div style="position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:32px; gap:12px;">
              <div style="font-size:14px; background:rgba(0,210,255,0.8); color:#0e1117; padding:6px 12px; border-radius:999px; font-weight:700;">{{slides[currentSlide].badge}}</div>
              <h1 style="font-size:36px; font-weight:800; line-height:1.1; max-width:520px;">
                <span style="color:#34d399;">{{slides[currentSlide].title1}}</span> {{slides[currentSlide].title2}}
              </h1>
              <p style="font-size:16px; color:#e7ecf3; max-width:520px;">{{slides[currentSlide].subtitle}}</p>
              <div style="display:flex; gap:12px;">
                <a href="#catalogo" style="padding:10px 16px; background:linear-gradient(135deg,#22c55e,#00d2ff); color:#0e1117; border-radius:12px; font-weight:700; text-decoration:none;">Ver brinquedos</a>
                <a href="#agendar" style="padding:10px 16px; background:rgba(0,0,0,0.35); color:#f5f7fa; border:1px solid rgba(255,255,255,0.1); border-radius:12px; text-decoration:none;">Agendar agora</a>
              </div>
            </div>
            <div style="position:absolute; bottom:14px; left:50%; transform:translateX(-50%); display:flex; gap:8px;">
              <button *ngFor="let s of slides; index as i"
                      (click)="goToSlide(i)"
                      [style.background]="i===currentSlide ? '#00d2ff' : '#ffffff66'"
                      style="width:10px; height:10px; border-radius:50%; border:none; cursor:pointer;"></button>
            </div>
            <button (click)="prevSlide()" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.4); color:#fff; border:none; border-radius:999px; width:36px; height:36px; cursor:pointer;">‹</button>
            <button (click)="nextSlide()" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.4); color:#fff; border:none; border-radius:999px; width:36px; height:36px; cursor:pointer;">›</button>
          </div>
        </div>
      </section>

      <section style="padding:32px 24px; max-width:1300px; margin:0 auto; display:flex; gap:16px;">
        <aside style="width:240px; background:#111623; border:1px solid #1d2433; border-radius:16px; padding:16px; box-shadow:0 10px 40px rgba(0,0,0,0.4);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; color:#89e8ff; font-weight:700;">Categorias</div>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;">
            <li *ngFor="let cat of categories" style="display:flex; align-items:center; justify-content:space-between; background: {{cat.active ? '#00d2ff' : 'transparent'}}; color: {{cat.active ? '#0e1117' : '#e7ecf3'}}; padding:10px 12px; border-radius:10px; border:1px solid #1d2433; cursor:pointer;">
              <span style="font-weight:600;">{{cat.name}}</span>
              <span style="background: {{cat.active ? '#0e1117' : '#1d2433'}}; color: {{cat.active ? '#00d2ff' : '#e7ecf3'}}; padding:4px 8px; border-radius:12px; font-size:12px; min-width:28px; text-align:center;">{{cat.count}}</span>
            </li>
          </ul>
        </aside>

        <div style="flex:1; display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:14px; color:#b8c1d4;">Mostrando {{cards.length}} brinquedos</div>
            <div style="display:flex; gap:10px; align-items:center;">
              <button routerLink="/login" style="padding:8px 12px; background:#1d2433; color:#f5f7fa; border:1px solid #1f2a3d; border-radius:10px; cursor:pointer;">Login</button>
              <button routerLink="/register" style="padding:8px 12px; background:#00d2ff; color:#0e1117; border:none; border-radius:10px; cursor:pointer; font-weight:700;">Cadastre-se</button>
            </div>
          </div>

          <div id="catalogo" style="display:grid; gap:16px; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));">
            <div *ngFor="let card of cards" style="background:#111623; border:1px solid #1d2433; border-radius:16px; padding:12px; box-shadow:0 10px 40px rgba(0,0,0,0.35);">
              <div style="position:relative; border-radius:12px; overflow:hidden; height:170px; background:#151b27;">
                <img [src]="card.image" alt="{{card.name}}" style="width:100%; height:100%; object-fit:cover;" />
                <div style="position:absolute; top:8px; left:8px; background:#ff9f43; color:#0e1117; padding:4px 8px; border-radius:999px; font-weight:700; font-size:12px;">{{card.ageRange}}</div>
                <div style="position:absolute; top:8px; right:8px; background:#00d2ff; color:#0e1117; padding:4px 8px; border-radius:999px; font-weight:700; font-size:12px;">{{card.size}}</div>
              </div>
              <div style="margin-top:12px; font-weight:700; font-size:16px; color:#f5f7fa;">{{card.name}}</div>
              <div style="color:#aeb7c8; font-size:13px; margin-bottom:8px;">{{card.category}}</div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#00d2ff; font-weight:700;">R$ {{card.price | number:'1.0-0'}}</span>
                <button (click)="selectProduct(card)"
                        [disabled]="!card.productId"
                        style="padding:8px 12px; background:#22c55e; color:#0e1117; border:none; border-radius:10px; cursor:pointer; font-weight:700; opacity: {{card.productId ? '1' : '0.5'}};">
                  Agendar
                </button>
              </div>
            </div>
          </div>

          <section id="agendar" style="background:#111623; border:1px solid #1d2433; border-radius:16px; padding:16px; margin-top:8px;">
            <h3 style="margin-bottom:8px;">Agendamento</h3>
            <p style="color:#aeb7c8; margin-bottom:12px;">Escolha uma data e envie seu pedido. É preciso estar logado como cliente e ter endereço preenchido.</p>
            <div *ngIf="selectedProduct" style="margin-bottom:8px; font-weight:600;">Brinquedo: {{selectedProduct.name}}</div>
            <div *ngIf="bookingSuccess" style="color:#22c55e; margin-bottom:12px;">Agendamento recebido! Número: {{bookingSuccess}}</div>
            <div *ngIf="bookingError" style="color:#f87171; margin-bottom:12px;">{{bookingError}}</div>

            <form (ngSubmit)="submitBooking()" #bookingForm="ngForm" style="display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));">
              <label style="color:#dfe4ed;">
                Data do evento
                <input name="eventDate" [(ngModel)]="booking.eventDate" required type="date" style="width:100%; padding:10px; border:1px solid #1f2a3d; background:#0f141e; color:#f5f7fa; border-radius:10px;" />
              </label>
              <label style="grid-column:1/-1; color:#dfe4ed;">
                Observações
                <textarea name="notes" [(ngModel)]="booking.notes" rows="3" style="width:100%; padding:10px; border:1px solid #1f2a3d; background:#0f141e; color:#f5f7fa; border-radius:10px;"></textarea>
              </label>
              <div style="grid-column:1/-1; text-align:right;">
                <button type="submit" [disabled]="bookingForm.invalid || submitting || !booking.productId" style="padding:10px 16px; background:#00d2ff; color:#0e1117; border:none; border-radius:12px; cursor:pointer; font-weight:700;">
                  {{submitting ? 'Enviando...' : 'Enviar agendamento'}}
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </div>
  `
})
export class HomePage implements OnInit, OnDestroy {
  products: any[] = [];
  cards: any[] = [];
  loadError = '';
  bookingError = '';
  bookingSuccess = '';
  submitting = false;
  selectedProduct: any = null;
  role: string | null = null;
  profile: any = null;

  booking: any = {
    eventDate: '',
    productId: null,
    notes: ''
  };

  categories = [
    { name: 'Todos os Brinquedos', count: 12, active: true },
    { name: 'Brinquedos Aquáticos', count: 4, active: false },
    { name: 'Diversão para Todas as Idades', count: 3, active: false },
    { name: 'Cama Elástica', count: 2, active: false },
    { name: 'Jogos de Mesa', count: 2, active: false },
    { name: 'Linha Home', count: 1, active: false }
  ];

  private sampleCards = [
    { name: 'Tobogã Aquático Tropical', category: 'Brinquedos Aquáticos', ageRange: '3-12 anos', size: '8x4x5m', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60', price: 580 },
    { name: 'Castelo Pula-Pula Gigante', category: 'Diversão', ageRange: '2-10 anos', size: '6x6x4m', image: 'https://images.unsplash.com/photo-1582719478248-54e9f2af39d7?auto=format&fit=crop&w=800&q=60', price: 520 },
    { name: 'Cama Elástica com Rede', category: 'Cama Elástica', ageRange: '4-14 anos', size: '3x3x2.5m', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60', price: 400 },
    { name: 'Piscina de Bolinhas Gigante', category: 'Diversão', ageRange: '1-8 anos', size: '4x4x1m', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60', price: 450 },
    { name: 'Tobogã Duplo Aquático', category: 'Brinquedos Aquáticos', ageRange: '5-15 anos', size: '10x5x6m', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60', price: 620 },
    { name: 'Cama Elástica Profissional', category: 'Cama Elástica', ageRange: '6-16 anos', size: '4x4x3m', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60', price: 520 },
    { name: 'Castelo das Princesas', category: 'Diversão', ageRange: '3-10 anos', size: '5x5x4m', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=60', price: 540 },
    { name: 'Pista de Obstáculos', category: 'Aventura', ageRange: '6-14 anos', size: '12x4x4m', image: 'https://images.unsplash.com/photo-1542293787938-4d273c379c83?auto=format&fit=crop&w=800&q=60', price: 700 },
    { name: 'Mega Water Slide', category: 'Brinquedos Aquáticos', ageRange: '4-12 anos', size: '9x4x5m', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=60', price: 650 }
  ];
  slides = [
    {
      image: 'https://images.unsplash.com/photo-1504691342899-4d92b50853e1?auto=format&fit=crop&w=1400&q=60',
      badge: 'Aluguel de brinquedos',
      title1: 'Diversão garantida',
      title2: 'para sua festa!',
      subtitle: 'Brinquedos infláveis e camas elásticas com qualidade premium.'
    },
    {
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60',
      badge: 'Segurança e alegria',
      title1: 'Camas elásticas',
      title2: 'para todas as idades',
      subtitle: 'Montagem rápida e equipe especializada.'
    },
    {
      image: 'https://images.unsplash.com/photo-1582719478248-54e9f2af39d7?auto=format&fit=crop&w=1400&q=60',
      badge: 'Festas inesquecíveis',
      title1: 'Castelos e tobogãs',
      title2: 'coloridos e seguros',
      subtitle: 'Escolha o tamanho ideal para seu espaço.'
    }
  ];
  currentSlide = 0;
  private slideTimer: any;

  constructor(
    private productService: ProductService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    if (this.authService.isLoggedIn()) {
      this.authService.loadProfile().subscribe({
        next: (profile) => {
          this.profile = profile;
          this.role = profile?.role || this.authService.getRole();
        },
        error: () => this.role = this.authService.getRole()
      });
    }
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
        this.products = data;
        this.cards = this.buildCards(data);
      },
      error: (err) => this.loadError = err?.error?.message || 'Erro ao carregar catálogo'
    });
    // even se API falhar, mostramos cards estáticos
    this.cards = this.buildCards(this.products);
  }

  selectProduct(p: any) {
    this.selectedProduct = p;
    this.booking.productId = p.id;
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/register');
      return;
    }
    const role = this.role || this.authService.getRole();
    if (role === 'ADMIN') {
      this.router.navigateByUrl('/admin');
      return;
    }
    if (role !== 'CUSTOMER') {
      this.router.navigateByUrl('/register');
      return;
    }
    if (this.profile && this.profile.addressComplete === false) {
      this.bookingError = 'Complete o cadastro de endereço para agendar.';
    } else {
      this.bookingError = '';
    }
  }

  submitBooking() {
    this.bookingError = '';
    this.bookingSuccess = '';
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/register');
      return;
    }
    this.submitting = true;
    this.bookingService.createBooking({
      ...this.booking
    }).subscribe({
      next: (res) => {
        this.bookingSuccess = res.id;
        this.submitting = false;
      },
      error: (err) => {
        this.bookingError = err?.error?.message || 'Erro ao enviar agendamento';
        this.submitting = false;
      }
    });
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
    if (products && products.length > 0) {
      return products.slice(0, 9).map((p, idx) => {
        const extra = this.sampleCards[idx % this.sampleCards.length];
        return {
          ...extra,
          name: p.name,
          productId: p.id,
          price: p.salePrice ?? extra.price
        };
      });
    }
    return this.sampleCards;
  }
}
