import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:420px; margin:48px auto; padding:24px; border:1px solid #e0e0e0; border-radius:12px; background:#fff;">
      <h2 style="margin-bottom:12px;">Entrar</h2>
      <div style="display:flex; flex-direction:column; gap:12px;">
        <label>
          Usuário
          <input [(ngModel)]="username" placeholder="seu usuário" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          Senha
          <input [(ngModel)]="password" type="password" placeholder="senha" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <button (click)="login()" style="padding:10px 14px; background:#1976d2; color:#fff; border:none; border-radius:6px; cursor:pointer;">Login</button>
        <div *ngIf="error" style="color:#d32f2f;">{{error}}</div>
        <div style="font-size:12px; color:#666;">Dicas: admin/adminpass para administrador</div>
      </div>
    </div>
  `
})
export class LoginPage {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.authService.loadProfile().subscribe({
          next: (profile) => {
            const role = profile?.role;
            this.router.navigateByUrl(role === 'ADMIN' ? '/admin' : '/');
          },
          error: () => this.router.navigateByUrl('/')
        });
      },
      error: (err) => this.error = err?.error?.message || 'Falha no login'
    });
  }
}
