import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/authGuard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
