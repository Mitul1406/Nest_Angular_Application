import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = ''; // <-- new field
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private auth: AuthService, private router: Router,private cd: ChangeDetectorRef) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        
        this.loading = false;
        if (res.message) {
          localStorage.setItem('otpEmail', this.email);
          this.successMessage = res.message;
          this.router.navigate(['/verify-otp']);
        } else {
          this.errorMessage = res.message || 'Invalid credentials';
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        
        this.loading = false;
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        
        this.cd.detectChanges();
      }
    });
  }
}