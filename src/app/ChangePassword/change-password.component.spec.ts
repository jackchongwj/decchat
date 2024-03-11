import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../Services/Auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authService: AuthService;
  let messageService: NzMessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [ ChangePasswordComponent ],
      providers: [
        AuthService,
        NzMessageService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService);
    messageService = TestBed.inject(NzMessageService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.changePasswordForm.valid).toBeFalsy();
  });

  it('password fields validity', () => {
    let newPassword = component.changePasswordForm.controls['newPassword'];
    
    // Test the initial state of the password field
    expect(newPassword.valid).toBeFalsy(); // The field should initially be invalid
    
    // Test the field with a value that does not meet the validation requirements
    newPassword.setValue("12345");
    expect(newPassword.valid).toBeFalsy(); // Still invalid due to not meeting criteria
    
    // Now set a value that meets all validation requirements
    newPassword.setValue("Aa#12345");
    expect(newPassword.valid).toBeTruthy(); // The field should now be valid
    
    // Directly check for the absence of errors to confirm that the password is indeed valid
    expect(newPassword.errors).toBeNull(); // Confirming no errors are present
  });
  

  it('password match validator', () => {
    let newPassword = component.changePasswordForm.controls['newPassword'];
    let confirmPassword = component.changePasswordForm.controls['confirmPassword'];

    newPassword.setValue('Aa#12345');
    confirmPassword.setValue('Aa#12345');
    expect(component.changePasswordForm.errors).toBeNull();
  });

  it('submitting a form emits a user', fakeAsync(() => {
    // Initial form validity should be false because it's empty
    expect(component.changePasswordForm.valid).toBeFalsy();
    
    // Set valid values for the form controls
    component.changePasswordForm.controls['currentPassword'].setValue("oldPassword");
    component.changePasswordForm.controls['newPassword'].setValue("NewPassword1!");
    component.changePasswordForm.controls['confirmPassword'].setValue("NewPassword1!");
    
    // Form should now be valid
    expect(component.changePasswordForm.valid).toBeTruthy();
  
    // Spy on router.navigate method
    let navigateSpy = spyOn(router, 'navigate');
  
    // Mock the authService.changePassword method to return an observable that emits true
    spyOn(authService, 'changePassword').and.returnValue(of(true));
  
    // Submit the form
    component.onSubmit();
  
    // Simulate the passage of time for any asynchronous operations
    tick();
  
    // Use flush to ensure no tasks are left in the queue
    flush();
  
    // Verify navigation was called with the expected route
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show error message on form submit failure', fakeAsync(() => {
    spyOn(authService, 'changePassword').and.returnValue(throwError(() => new Error('Incorrect Current Password')));
    spyOn(messageService, 'create');

    component.changePasswordForm.controls['currentPassword'].setValue("oldPassword");
    component.changePasswordForm.controls['newPassword'].setValue("NewPassword1!");
    component.changePasswordForm.controls['confirmPassword'].setValue("NewPassword1!");
    component.onSubmit();
    tick();

    expect(messageService.create).toHaveBeenCalledWith('error', 'Incorrect Current Password');
  }));
});
