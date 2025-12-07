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
    password: '',
    addressLine2: '',
    city2: '',
    state2: '',
    postalCode2: '',
    addressLine3: '',
    city3: '',
    state3: '',
    postalCode3: ''
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
          addressLine2: profile?.addressLine2 || '',
          city2: profile?.city2 || '',
          state2: profile?.state2 || '',
          postalCode2: profile?.postalCode2 || '',
          addressLine3: profile?.addressLine3 || '',
          city3: profile?.city3 || '',
          state3: profile?.state3 || '',
          postalCode3: profile?.postalCode3 || '',
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
