import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  form: any = {
    name: '',
    email: '',
    password: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: ''
  };
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';
    if (!this.form.name || !this.form.email || !this.form.phone || !this.form.postalCode) {
      this.error = 'Preencha nome, email, telefone e CEP.';
      return;
    }
    this.authService.registerCustomer({
      username: this.form.email,
      password: this.form.password,
      name: this.form.name,
      phone: this.form.phone,
      email: this.form.email,
      addressLine: this.form.addressLine,
      city: this.form.city,
      state: this.form.state,
      postalCode: this.form.postalCode
    }).subscribe({
      next: () => {
        this.success = 'Conta criada com sucesso! Você já está logado.';
        setTimeout(() => this.router.navigateByUrl('/'), 1200);
      },
      error: (err) => this.error = err?.error?.message || 'Erro ao registrar'
    });
  }
}
