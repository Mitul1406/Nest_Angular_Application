import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
   standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',

})
export class RegisterComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.loading = true;
    this.auth.register({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            localStorage.setItem('otpEmail', this.email);
            this.router.navigate(['/verify-otp']);
          }
          alert(res.message);
        },
        error: () => this.loading = false
      });
  }
}