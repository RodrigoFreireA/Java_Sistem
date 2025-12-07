import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.success = '';
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.success = 'Login realizado com sucesso!';
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
