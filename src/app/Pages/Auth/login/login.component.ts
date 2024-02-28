import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/Auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenService } from '../../../Services/Token/token.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';

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

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService
    ) {}

  submitForm(): void {
    if (this.validateForm.valid) {
      const loginData = this.validateForm.value;

      this.authService.login(loginData).subscribe({
        next: (res) => {
          this.message.success(res.Message || 'Login successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (e) => {
          console.error('Login failed:', e);
          this.message.error(e.error.Error || 'Login failed. Please try again.');
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
