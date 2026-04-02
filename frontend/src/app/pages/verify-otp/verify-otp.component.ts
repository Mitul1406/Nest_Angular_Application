import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { TokenService } from '../../core/services/token';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verify-otp.component.html',
})
export class VerifyOtpComponent {
  otp = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: AuthService,
    private token: TokenService,
    private router: Router,
    private cd:ChangeDetectorRef
  ) {}

  verifyOtp() {
    const email = localStorage.getItem('otpEmail');
    if (!email) {
      this.clearAndRedirect();
      return;
    }

    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.verifyOtp({ email, otp: this.otp }).subscribe({
      next: (res: any) => {
        this.loading = false;
        
        if (res.success) {
          this.token.setTokens(res.data.accessToken, res.data.refreshToken);
          this.successMessage = res.message || 'OTP verified successfully!';

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.errorMessage = res.message || 'Invalid OTP. Please try again.';
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'OTP verification failed.';
        this.cd.detectChanges();
      },
    });
  }

  resendOtp() {
    const email = localStorage.getItem('otpEmail');
    if (!email) {
      this.clearAndRedirect();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.resendOtp(email).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = res?.data?.message || 'OTP resent successfully!';
        this.cd.detectChanges();

      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to resend OTP.';
        this.cd.detectChanges();

      },
    });
  }

  clearAndRedirect() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}