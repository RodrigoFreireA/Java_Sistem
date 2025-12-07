import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../product.service';
import { BookingService } from '../../booking.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking implements OnInit {
  product: any = null;
  error = '';
  success = '';
  submitting = false;
  booking: any = { eventDate: '', notes: '', productId: null };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Produto invalido para agendar.';
      return;
    }
    this.booking.productId = id;
    this.productService.getById(id).subscribe({
      next: (p) => this.product = p,
      error: () => this.error = 'Nao foi possivel carregar o brinquedo. Cadastre-o no painel Admin e tente novamente.'
    });
  }

  submit() {
    this.error = '';
    this.success = '';
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.submitting = true;
    this.bookingService.createBooking({
      eventDate: this.booking.eventDate,
      notes: this.booking.notes,
      productId: this.booking.productId
    }).subscribe({
      next: (res) => {
        this.success = res.id;
        this.submitting = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erro ao enviar agendamento';
        this.submitting = false;
      }
    });
  }
}
