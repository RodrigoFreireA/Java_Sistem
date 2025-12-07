import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  form: any = {
    name: '',
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    password: ''
  };
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.load();
  }

  load() {
    this.error = '';
    this.authService.loadProfile().subscribe({
      next: (profile) => {
        this.form = {
          name: profile?.name || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          addressLine: profile?.addressLine || '',
          city: profile?.city || '',
          state: profile?.state || '',
          postalCode: profile?.postalCode || '',
          password: ''
        };
      },
      error: (err) => this.error = err?.error?.message || 'Erro ao carregar perfil'
    });
  }

  save() {
    this.error = '';
    this.success = '';
    this.authService.updateProfile(this.form).subscribe({
      next: () => this.success = 'Perfil atualizado com sucesso!',
      error: (err) => this.error = err?.error?.message || 'Erro ao salvar perfil'
    });
  }
}
