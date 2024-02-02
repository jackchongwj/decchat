import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {

  constructor(private http: HttpClient, private message: NzMessageService, private cookieService: CookieService) {}

  logout(): void {
    const logoutEndpoint = 'https://localhost:7184/api/auth/logout';

    // Make an HTTP POST request to trigger the logout action on the server
    this.http.post(logoutEndpoint, {}).pipe(
      map((response: any) => {
        // Check headers and cookies to determine success
        const headers = response.headers;
        const refreshToken = this.cookieService.get('refreshToken');

        if (headers && headers.get('Authorization') === null && !refreshToken) {
          this.message.success('Logged out successfully!');
        } else {
          throw new Error('Logout failed');
        }
      }),
      catchError((error) => {
        console.error('Logout failed', error);
        this.message.error('Logout failed');
        throw error;
      })
    ).subscribe();
  }
}
