import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {

  constructor(private localStorageService: LocalstorageService, private authService: AuthService, private message: NzMessageService, private router: Router) {}

  logout(): void {

    this.authService.logout().subscribe({
      next: (res) => {
        this.localStorageService.clear();

        console.log('Logout successful!', res)
        this.message.success('Logout successful!');
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.error('Logout failed', e);
        this.message.error('Logout failed');
      }
    });
  }
}
