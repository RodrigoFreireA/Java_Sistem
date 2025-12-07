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
  booking: any = { eventDate: '', notes: '', productId: null, addressLine: '', city: '', state: '', postalCode: '' };
  addresses: { label: string; value: string; addressLine?: string; city?: string; state?: string; postalCode?: string }[] = [];
  selectedAddress = 'principal';

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

    if (this.authService.isLoggedIn()) {
      this.authService.loadProfile().subscribe({
        next: (profile) => {
          this.addresses = [
            { label: 'Endereço principal', value: 'principal', addressLine: profile?.addressLine, city: profile?.city, state: profile?.state, postalCode: profile?.postalCode },
            { label: 'Endereço 2 (opcional)', value: 'end2', addressLine: profile?.addressLine2, city: profile?.city2, state: profile?.state2, postalCode: profile?.postalCode2 },
            { label: 'Endereço 3 (opcional)', value: 'end3', addressLine: profile?.addressLine3, city: profile?.city3, state: profile?.state3, postalCode: profile?.postalCode3 },
            { label: 'Usar outro endereço', value: 'custom' }
          ];
          this.setAddressByValue('principal');
        },
        error: () => {}
      });
    }
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
      productId: this.booking.productId,
      addressLine: this.booking.addressLine,
      city: this.booking.city,
      state: this.booking.state,
      postalCode: this.booking.postalCode
    }).subscribe({
      next: (res) => {
        this.success = res.id;
        this.submitting = false;
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Erro ao enviar agendamento';
        this.error = msg;
        this.submitting = false;
      }
    });
  }

  onAddressChange(value: string) {
    this.selectedAddress = value;
    this.setAddressByValue(value);
  }

  private setAddressByValue(value: string) {
    if (value === 'custom') {
      this.booking.addressLine = '';
      this.booking.city = '';
      this.booking.state = '';
      this.booking.postalCode = '';
      return;
    }
    const found = this.addresses.find(a => a.value === value);
    this.booking.addressLine = found?.addressLine || '';
    this.booking.city = found?.city || '';
    this.booking.state = found?.state || '';
    this.booking.postalCode = found?.postalCode || '';
  }
}
