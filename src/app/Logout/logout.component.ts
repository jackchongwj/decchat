import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../Services/Auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {

  constructor(private authService: AuthService, private message: NzMessageService, private router: Router) {}

  submit(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        this.message.success(res.Message || 'Logout successful');
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.error('Logout failed', e);
        this.message.error(e.error || 'An error occured during logout. Please log in again.');
      }
    });
  }
}
