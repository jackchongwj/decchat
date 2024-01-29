import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  validateForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true]
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      const loginData = this.validateForm.value;

      // Assuming your API endpoint for login is /api/auth/login
      const apiUrl = 'https://localhost:7184/api/auth/login';

      // Make the HTTP request to your backend API
      this.http.post(apiUrl, loginData)
      .pipe(
        tap((response: any) => {
          console.log('Login successful!');

          this.router.navigate(['/']);
        }),
        catchError((error: any) => {
          console.error('Login failed:', error);

          // Handle failure, show error message, etc.
          throw error; // Rethrow the error to propagate it to the outer error handling
        })
      )
      .subscribe();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }

  constructor(private fb: NonNullableFormBuilder, private router: Router, private http: HttpClient) {}
}
