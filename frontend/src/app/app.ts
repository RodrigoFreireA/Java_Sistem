import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="topbar__inner">
        <div class="brand">
          <div class="brand-logo">PM</div>
          <div>
            <div class="brand-name">PlayMove</div>
            <div class="brand-sub">Aluguel de Brinquedos</div>
          </div>
        </div>
        <nav class="menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/" fragment="catalogo">Brinquedos</a>
          <a routerLink="/" fragment="contato">Contato</a>
          <a *ngIf="!isLoggedIn()" routerLink="/login" class="btn-login">Login</a>

          <div *ngIf="isLoggedIn()" class="dropdown" (mouseleave)="dropdownOpen=false">
            <button class="btn-login" (click)="toggleDropdown()">
              Perfil ▾
            </button>
            <div class="dropdown-menu" *ngIf="dropdownOpen">
              <a routerLink="/perfil">Meu perfil</a>
              <button (click)="logout()">Logout</button>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {
  dropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false;
    this.router.navigateByUrl('/');
  }
}
