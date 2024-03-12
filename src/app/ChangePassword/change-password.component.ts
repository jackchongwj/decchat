import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../Services/UserService/user.service';
import { PasswordChange } from '../Models/DTO/User/password-change';
import { AuthService } from '../Services/Auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  private userId: number = this.lsService.getUserId();

  constructor(
    private message: NzMessageService,
    private authService: AuthService,
    private router: Router,
    private lsService:LocalstorageService) 
    {
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
      const passwordChangeData: PasswordChange = {
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        // Include any additional fields required by your PasswordChange model
      };
  
      this.authService.changePassword(passwordChangeData).subscribe({
        next: () => {
          this.message.create('success', 'Password successfully changed');
          this.router.navigate(['/dashboard']);
          // You might want to navigate the user or reset the form here
        },
        error: error => {
          this.message.create('error', `Incorrect Current Password`);
          // Handle your error state here
        }
      });
    } else {
      // Trigger validation for all form fields
      Object.values(this.changePasswordForm.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
        }
      });
    }
  }
  

  goBack() {
    this.router.navigate(['/dashboard']); // Or use this.router.navigateByUrl('/') for a similar effect
  }
}
