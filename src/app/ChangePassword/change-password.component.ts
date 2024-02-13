import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../Services/UserService/user.service';
import { PasswordChange } from '../Models/DTO/User/password-change.model';
import { AuthService } from '../Services/Auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        this.passwordStrengthValidator()
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordsMatchValidator() });
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /\d/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength = value.length >= 8;

      const errors: ValidationErrors = {
        minLength: !isValidLength,
        requiresDigit: !hasNumeric,
        requiresUppercase: !hasUpperCase,
        requiresLowercase: !hasLowerCase,
        requiresSpecialChars: !hasSpecial
      };

      return hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && isValidLength ? null : errors;
    };
  }

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      let newPassword = group.get('newPassword')?.value;
      let confirmPassword = group.get('confirmPassword')?.value;
      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const userId = 7; // Placeholder user ID; replace as needed
      const passwordChangeData = new PasswordChange(
        this.changePasswordForm.get('currentPassword')?.value??'',
        this.changePasswordForm.get('newPassword')?.value??''
      );

      this.authService.changePassword(userId, passwordChangeData).subscribe({
        next: () => {
          alert('Password successfully changed.');
          this.router.navigate(['/']); // Navigate back to the main page.
        },
        error: error => {
          alert('Failed to change password: ' + error.message);
        }
      });
    } else {
      // Trigger validation for all form fields
      Object.values(this.changePasswordForm.controls).forEach(control => {
        control.updateValueAndValidity();
      });
    }
  }

  goBack() {
    this.router.navigate(['/']); // Or use this.router.navigateByUrl('/') for a similar effect
  }
}
