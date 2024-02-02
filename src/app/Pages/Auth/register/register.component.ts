import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  private isLoading = false;

  get minLengthValid() {
    const passwordControl = this.registerForm.controls["password"];
    return !passwordControl.hasError("required") && passwordControl.value.length >= 8;
  }
  
  get requiresDigitValid() {
    const passwordControl = this.registerForm.controls["password"];
    const digitRegex = /\d/;
    return !passwordControl.hasError("required") && digitRegex.test(passwordControl.value);
  }
  
  get requiresUppercaseValid() {
    const passwordControl = this.registerForm.controls["password"];
    const uppercaseRegex = /[A-Z]/;
    return !passwordControl.hasError("required") && uppercaseRegex.test(passwordControl.value);
  }
  
  get requiresLowercaseValid() {
    const passwordControl = this.registerForm.controls["password"];
    const lowercaseRegex = /[a-z]/;
    return !passwordControl.hasError("required") && lowercaseRegex.test(passwordControl.value);
  }
  
  get requiresSpecialCharsValid() {
    const passwordControl = this.registerForm.controls["password"];
    const specialCharsRegex = /[$@^!%*?&]/;
    return !passwordControl.hasError("required") && specialCharsRegex.test(passwordControl.value);
  }

  get usernameErrorMessage() {
    const usernameControl = this.registerForm.controls["username"];
    const errors: string[] = [];
  
    if (usernameControl.hasError("required")) {
      errors.push("Please enter your username");
    } 
    else if (usernameControl.hasError("invalid")) {
      errors.push("Invalid character(s) detected");
    }
    else if (usernameControl.hasError("maximum")) {
      errors.push("Maximum length (15) reached");
    }
  
    return errors;
  }

  get passwordNotEmpty() {
    return !this.registerForm.controls["password"].hasError("required");
  }

  get validationErrorMessage() {
    const passwordControl = this.registerForm.controls["password"];
    const errors: string[] = [];
  
    if (passwordControl.hasError("required")) {
      errors.push("Please enter a password");
    } 
    else if (passwordControl.hasError("strength")) {
      errors.push("Please satisfy all the requirements above");
    }
    else if (passwordControl.hasError("maximum")) {
      errors.push("Maximum length (16) reached");
    }
    else if (passwordControl.hasError("invalid")) {
      errors.push("Invalid character(s) detected");
    }
  
    return errors;
  }

  get confirmPasswordErrorMessage() {
    const confirmPasswordControl = this.registerForm.controls["confirmPassword"];
    const errors: string[] = [];
  
    if (confirmPasswordControl.hasError("required")) {
      errors.push("Please re-enter your password");
    } 
    else if (confirmPasswordControl.hasError("mismatch")) {
      errors.push("Passwords do not match");
    }
  
    return errors;
  }

  usernameValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const value: string = control.value;
  
    // Check for empty field
    if (!value) {
      return { required: true };
    }
  
    // Check for invalid characters
    const invalidCharsRegex = /[^a-zA-Z\d$@^!%*?&]/; // You can modify this regex based on your specific requirements
  
    if (invalidCharsRegex.test(value)) {
      return { invalid: true };
    }
  
    // Check for exceeding limit (15 characters)
    const maxLength = 15;
  
    if (value.length > maxLength) {
      return { maximum: true };
    }
  
    return null;
  };

  passwordValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const value: string = control.value;
    const errors: { [key: string]: boolean } = {};

    // Check for empty password
    if (!value) {
      errors['required'] = true;
      return { required: true };
    }
  
    // Check for maximum length
    const maxLength = 20;

    if (value.length > maxLength) {
      errors ['maxLength'] = true;
      return { maximum: true };
    }

    // Check for invalid characters
    const invalidCharsRegex = /[^a-zA-Z\d$@^!%*?&]/;

    if (invalidCharsRegex.test(value)) {
      errors['invalid'] = true;
      return { invalid: true };
    }
    
    // Password strength validation
    const minLength = 8;
    const digitRegex = /\d/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharsRegex = /[$@^!%*?&]/;
  
    // minimum length
    if (value.length < minLength) {
      errors['minLength'] = true;
      return { strength: true };
    }
  
    // digit
    if (!digitRegex.test(value)) {
      errors['requiresDigit'] = true;
      return { strength: true };
    }
  
    // uppercase
    if (!uppercaseRegex.test(value)) {
      errors['requiresUppercase'] = true;
      return { strength: true };
    }
  
    // lowercase
    if (!lowercaseRegex.test(value)) {
      errors['requiresLowercase'] = true;
      return { strength: true };
    }
  
    // special characters
    if (!specialCharsRegex.test(value)) {
      errors['requiresSpecialChars'] = true;
      return { strength: true };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    } else if (value !== this.registerForm.controls.password.value && this.registerForm.controls.password.value) {
      return { mismatch: true };
    }
    return null;
  };
  
  getValidationStatus(controlName: string): string {
    const control = this.registerForm.get(controlName);
  
    if (control && control.touched && !this.isLoading) {
      if (controlName === 'username') {
        if (control.hasError('required') || control.hasError('invalid') || control.hasError('maxLength')) {
          return 'error';
        } else {
          return 'success';
        }
      } else if (controlName === 'password') {
        return control.valid ? 'success' : 'error';
      } else if (controlName === 'confirmPassword') {
        const passwordControl = this.registerForm.get('password');
  
        if (!control.value) {
          return 'error';
        } else {
          return passwordControl && control.value === passwordControl.value ? 'success' : 'error';
        }
      }
    }
  
    return '';
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      const registrationData = this.registerForm.value;
  
      const apiUrl = 'https://localhost:7184/api/auth/register';

      this.http.post(apiUrl, registrationData)
        .pipe(
          tap((response: any) => {
            this.isLoading = false;
            this.registerForm.enable();

            this.message.success('Registration successful!')

            this.router.navigate(['/login']);
          }),
          catchError((error: any) => {
            console.error(error);

            this.isLoading = true;
            this.registerForm.disable();

            this.message.error('Registration failed')
            throw error; 
          })
        )
        .subscribe();
    } else {
      // Mark invalid controls as dirty to display validation errors
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.registerForm.controls.confirmPassword.updateValueAndValidity());
  }

  constructor(private fb: NonNullableFormBuilder, private message: NzMessageService, private router: Router, private http: HttpClient) {
    // Set up form builder and validator
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required, this.confirmationValidator]]
    });

    // Set up event listener for password confirmation
    const passwordControl = this.registerForm.get('password');
    
    if (passwordControl) {
      passwordControl.valueChanges.subscribe(() => {
        this.updateConfirmValidator();
      });
    }
  }
}
