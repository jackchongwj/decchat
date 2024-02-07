// src/app/ChangePassword/change-password.component.ts

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../Services/UserService/user.service';
import { Router } from '@angular/router';
import { PasswordChange } from '../Models/DTO/User/password-change.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.value.newPassword !== this.changePasswordForm.value.confirmPassword) {
        alert('New Password and Confirm Password do not match.');
        return;
      }

      const userId = 7;
      const passwordChangeData = new PasswordChange(
        this.changePasswordForm.value.currentPassword!,
        this.changePasswordForm.value.newPassword!
      );

      this.userService.changePassword(userId, passwordChangeData).subscribe({
        next: () => {
          alert('Password successfully changed.');
          this.router.navigate(['/']); // Navigate back to the main page.
        },
        error: error => {
          alert('Failed to change password: ' + error.message);
        }
      });
    }
  }
}
