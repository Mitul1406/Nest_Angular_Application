import { Component } from '@angular/core';
import { Users } from '../../core/services/users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  imageUrl: string | null = null;
  user:any;

constructor(private userService: Users) {}

ngOnInit() {
  const userId = localStorage.getItem('otpEmail');
  if (!userId) return;

  this.userService.getUser(userId).subscribe((res: any) => {
    if (res.success && res.data.profilePic) {
      this.imageUrl =
        `http://localhost:4040/uploads/${res.data.profilePic}?t=${Date.now()}`;
    }
  });
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  // ✅ Instant preview
  this.imageUrl = URL.createObjectURL(file);

  // Upload
  this.userService.uploadProfile(file).subscribe((res: any) => {
    if (res.success) {
      this.imageUrl =
        `http://localhost:4040/uploads/${res.data.filename}?t=${Date.now()}`;
    }
  });
}

}