import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/Auth/auth.service';

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

  constructor(private fb: NonNullableFormBuilder, private router: Router, private authService: AuthService) {}

  submitForm(): void {
    if (this.validateForm.valid) {
      const loginData = this.validateForm.value;

      this.authService.login(loginData).subscribe({
        next: (res) => {
          this.authService.setToken(res.accessToken);
          this.authService.setUserId(res.userId);

          console.log('Login successful!');
          this.router.navigate(['/']);
        },
        error: (e) => {
          console.error('Login failed:', e);
        }
    });
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
}
