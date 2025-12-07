import { Routes } from '@angular/router';
import { HomePage } from './home-page.component';
import { LoginPage } from './login-page.component';
import { RegisterPage } from './register-page.component';
import { AdminPage } from './admin-page.component';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'admin', component: AdminPage }
];
