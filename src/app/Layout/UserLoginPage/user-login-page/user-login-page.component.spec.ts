import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLoginPageComponent } from './user-login-page.component';

describe('UserLoginPageComponent', () => {
  let component: UserLoginPageComponent;
  let fixture: ComponentFixture<UserLoginPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [UserLoginPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLoginPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct background image', () => {
      const img = element.querySelector('.login-background-image') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.src).toContain('/assets/loginpage.jpg');
      expect(img.alt).toBe('Login Page');
  });

});
