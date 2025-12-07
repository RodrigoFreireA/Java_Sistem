import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss',
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  error = '';

  constructor(private productService: ProductService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role !== 'ADMIN') {
      this.router.navigateByUrl('/');
      return;
    }
    this.load();
  }

  load() {
    this.error = '';
    this.productService.listAll().subscribe({
      next: (data) => this.products = data || [],
      error: (err) => this.error = err?.error?.message || 'Erro ao carregar brinquedos'
    });
  }
}
