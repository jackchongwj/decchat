import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../Services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {

  constructor(private authService: AuthService, private message: NzMessageService, private router: Router) {}

  logout(): void {

    this.authService.logout().subscribe({
      next: (res) => {
        this.authService.clearStorage();
        this.message.success('Logged out successfully!');
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.error('Logout failed', e);
        this.message.error('Logout failed');
      }
    });
  }
}
