import { Injectable } from '@angular/core';
import { TokenService } from '../Token/token.service';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  constructor(private tokenService: TokenService) {}

  initializeApp(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Example check to see if the user is authenticated
      const refreshToken = this.tokenService.getRefreshToken();
      if (!refreshToken) {
        resolve();
        return;
      }
      
      // Attempt to renew token here and then resolve
      this.tokenService.renewToken().subscribe({
        next: (token) => {
          if (token) {
            // Set new token and proceed
          }
          resolve();
        },
        error: (err) => {
          console.error('Initialization failed:', err);
          resolve(); // Resolve anyway to continue app initialization
        }
      });
    });
  }
}
