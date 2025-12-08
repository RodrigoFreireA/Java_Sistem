import { Component, HostListener } from '@angular/core';
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

          <div *ngIf="isLoggedIn()" class="dropdown">
            <button class="btn-login" (click)="toggleDropdown($event)">
              Perfil
            </button>
            <div class="dropdown-menu" *ngIf="dropdownOpen">
              <a routerLink="/perfil" (click)="closeDropdown()">Meu perfil</a>
              <a routerLink="/meus-agendamentos" (click)="closeDropdown()">Meus agendamentos</a>
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

  @HostListener('document:click')
  onDocumentClick() {
    this.dropdownOpen = false;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeDropdown();
    this.router.navigateByUrl('/');
  }
}
