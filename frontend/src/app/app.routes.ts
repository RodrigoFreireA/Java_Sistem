import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { Booking } from './pages/booking/booking';
import { AdminProducts } from './pages/admin-products/admin-products';
import { Profile } from './pages/profile/profile';
import { MyBookings } from './pages/my-bookings/my-bookings';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'perfil', component: Profile },
  { path: 'meus-agendamentos', component: MyBookings },
  { path: 'admin', component: Admin },
  { path: 'admin/produtos', component: AdminProducts },
  { path: 'agendar/:id', component: Booking }
];
