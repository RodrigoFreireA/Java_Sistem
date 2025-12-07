import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:600px; margin:32px auto; padding:24px; border:1px solid #e0e0e0; border-radius:12px; background:#fff;">
      <h2 style="margin-bottom:16px;">Cadastro de cliente</h2>
      <div *ngIf="error" style="color:#d32f2f; margin-bottom:8px;">{{error}}</div>
      <form (ngSubmit)="submit()" #regForm="ngForm" style="display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));">
        <label>
          Nome
          <input name="name" [(ngModel)]="form.name" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          Telefone
          <input name="phone" [(ngModel)]="form.phone" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          E-mail
          <input name="email" [(ngModel)]="form.email" type="email" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          Usuário
          <input name="username" [(ngModel)]="form.username" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          Senha
          <input name="password" [(ngModel)]="form.password" required type="password" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label style="grid-column:1/-1;">
          Endereço
          <input name="addressLine" [(ngModel)]="form.addressLine" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          Cidade
          <input name="city" [(ngModel)]="form.city" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          Estado
          <input name="state" [(ngModel)]="form.state" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <label>
          CEP
          <input name="postalCode" [(ngModel)]="form.postalCode" required style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" />
        </label>
        <div style="grid-column:1/-1; text-align:right;">
          <button type="submit" [disabled]="regForm.invalid || loading" style="padding:10px 16px; background:#1976d2; color:#fff; border:none; border-radius:8px; cursor:pointer;">
            {{ loading ? 'Enviando...' : 'Cadastrar e entrar' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class RegisterPage {
  form: any = {
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: ''
  };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.authService.registerCustomer(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.authService.loadProfile().subscribe(() => this.router.navigateByUrl('/'));
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erro ao cadastrar';
        this.loading = false;
      }
    });
  }
}
