import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports:[CommonModule,ProfileComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  role: string | null = '';
  email: string | null = '';

  ngOnInit() {
    this.role = this.token.getRole();
    this.email = localStorage.getItem('otpEmail');
  }

  constructor(private token: TokenService, private router: Router) {}

  logout() {
    this.token.clear();
    this.router.navigate(['/login']);
  }
}