import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header style="display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid #e0e0e0; position:sticky; top:0; background:#fff; z-index:10">
      <div style="display:flex; align-items:center; gap:12px">
        <div style="font-weight:700; font-size:18px;">ToyLog</div>
        <nav style="display:flex; gap:12px;">
          <a routerLink="/" style="text-decoration:none; color:#333; font-weight:600;">Home</a>
          <a routerLink="/" fragment="features" style="text-decoration:none; color:#333;">Funcionalidades</a>
          <a routerLink="/" fragment="contato" style="text-decoration:none; color:#333;">Contato</a>
        </nav>
      </div>
      <div>
        <a routerLink="/login" style="padding:8px 14px; background:#1976d2; color:#fff; border-radius:6px; text-decoration:none; font-weight:600;">Login</a>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {}
