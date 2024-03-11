import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { UserService } from '../Services/UserService/user.service';
import { AuthService } from '../Services/Auth/auth.service';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ImportNgZorroAntdModule } from '../ng-zorro-antd.module';

class MockUserService {
  getUserById = jasmine.createSpy().and.returnValue(of({ ProfileName: 'Test', ProfilePicture: 'URL' }));
  updateProfileName = jasmine.createSpy().and.returnValue(of({}));
  updateProfilePicture = jasmine.createSpy().and.returnValue(of({}));
  deleteUser = jasmine.createSpy().and.returnValue(of({}));
}

class MockAuthService {
  logout = jasmine.createSpy().and.returnValue(of({}));
}

class MockLocalstorageService {
  getItem = jasmine.createSpy().and.returnValue('1');
}

class MockDataShareService {
  updateLoginUserPN = jasmine.createSpy();
}

class MockNzMessageService {
  success = jasmine.createSpy();
  error = jasmine.createSpy();
}

class DummyLoginComponent {

}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userService: MockUserService;
  let authService: MockAuthService;
  let router: Router;
  let nzMessageService: NzMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyLoginComponent }
        ]),
        HttpClientTestingModule, 
        FormsModule, 
        ImportNgZorroAntdModule
      ],
      declarations: [UserProfileComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: LocalstorageService, useClass: MockLocalstorageService },
        { provide: DataShareService, useClass: MockDataShareService },
        { provide: NzMessageService, useClass: MockNzMessageService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    nzMessageService = TestBed.inject(NzMessageService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(userService.getUserById).toHaveBeenCalledWith(component.userId);
    expect(component.User.ProfileName).toBe('Test');
    expect(component.User.ProfilePicture).toBe('URL');
  }));

  it('should toggle edit mode and preserve original profile name', () => {
    component.User.ProfileName = 'TestUser';
    component.toggleEditMode();
    expect(component.editMode).toBeTrue();
    expect(component.originalProfileName).toEqual('TestUser');
    component.toggleEditMode();
    expect(component.editMode).toBeFalse();
  });

  it('should update profile name successfully', fakeAsync(() => {
    component.User.ProfileName = 'UpdatedName';
    component.saveProfileName();
    tick();
    expect(userService.updateProfileName).toHaveBeenCalledWith(component.userId, 'UpdatedName');
    expect(component.editMode).toBeFalse();
    expect(component.User.ProfileName).toEqual('UpdatedName');
    expect(nzMessageService.success).toHaveBeenCalled();
  }));

  it('should display error when update profile name with less than 2 characters', () => {
    component.User.ProfileName = 'U';
    component.saveProfileName();
    expect(nzMessageService.error).toHaveBeenCalledWith('Profile name must be at least 2 characters long.');
  });

  it('should successfully update profile picture', fakeAsync(() => {
    const mockFile = new File(["content"], "test.png", { type: "image/png" });
    
    component.selectedFile = mockFile;
    component.userId = 1;
    component.saveProfilePicture();
    tick();
    expect(userService.updateProfilePicture).toHaveBeenCalledWith(component.userId, mockFile);
    expect(nzMessageService.success).toHaveBeenCalled();
  }));

  it('should handle error when updating profile picture fails', fakeAsync(() => {
    userService.updateProfilePicture.and.returnValue(throwError(new Error('Upload failed')));
    const mockFile = new File(["content"], "test.png", { type: "image/png" });
    component.selectedFile = mockFile;
    component.userId = 1;
    component.saveProfilePicture();
    tick();
    expect(nzMessageService.error).toHaveBeenCalled();
  }));

  it('should successfully delete account and logout user', fakeAsync(() => {
    component.deleteAccount();
    tick();
    expect(userService.deleteUser).toHaveBeenCalledWith(component.userId);
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(nzMessageService.success).toHaveBeenCalledWith('Account Deleted');
  }));

  it('should cancel profile picture preview and clear selected file', () => {
    const mockFile = new File(["content"], "test.png", { type: "image/png" });
    component.previewImageUrl = URL.createObjectURL(mockFile);
    component.selectedFile = mockFile;
    component.cancelPreview();
    expect(component.previewImageUrl).toBeNull();
    expect(component.selectedFile).toBeNull();
  });

  it('should cancel editing and revert changes', () => {
    component.originalProfileName = 'OriginalName';
    component.User.ProfileName = 'EditedName';
    component.editMode = true;
    component.cancelEdit();
    expect(component.User.ProfileName).toEqual('OriginalName');
    expect(component.editMode).toBeFalse();
  });

  it('should successfully delete account and logout user', fakeAsync(() => {
    component.deleteAccount();
    tick();
    expect(userService.deleteUser).toHaveBeenCalledWith(component.userId);
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(nzMessageService.success).toHaveBeenCalledWith('Account Deleted');
  }));

  it('should handle error when deleting account fails', fakeAsync(() => {
    const errorMessage = 'Account deletion failed';
    userService.deleteUser.and.returnValue(throwError({ error: { Error: errorMessage } }));
  
    component.deleteAccount();
    tick();
    
    expect(userService.deleteUser).toHaveBeenCalledWith(component.userId);
    expect(nzMessageService.error).toHaveBeenCalledWith(errorMessage);
  }));  

  it('should cancel profile picture preview and clear selected file', () => {
    const mockFile = new File(["content"], "test.png", { type: "image/png" });
    component.previewImageUrl = URL.createObjectURL(mockFile);
    component.selectedFile = mockFile;
    component.cancelPreview();
    expect(component.previewImageUrl).toBeNull();
    expect(component.selectedFile).toBeNull();
  });

  it('should toggle modal visibility', () => {
    expect(component.showModal).toBeFalse();
    component.toggleModal();
    expect(component.showModal).toBeTrue();
    component.toggleModal();
    expect(component.showModal).toBeFalse();
  });

  it('should handle file selection and validate image file', fakeAsync(() => {
    // Create a new Blob object representing an image file.
    const blob = new Blob(['image-content'], { type: 'image/png' });
    const file = new File([blob], 'test-image.png', { type: 'image/png' });
    // Simulate the file list that would be present on an input element.
    const fileList = { 0: file, length: 1, item: (index: number) => file };
  
    // Spy on the files property to return the simulated file list.
    spyOnProperty(HTMLInputElement.prototype, 'files', 'get').and.returnValue(fileList);
  
    // Create a fake event object with the target containing the mocked files property.
    const event = new Event('change');
    Object.defineProperty(event, 'target', {value: {files: [file]}, enumerable: true});
  
    // Call the method under test with the fake event.
    component.onFileSelected(event);
  
    tick(); // Wait for any asynchronous operations.
  
    // Verify that the file was correctly selected and processed.
    expect(component.selectedFile).toEqual(file);
    expect(component.previewImageUrl).toBeTruthy();
  }));
  
  it('should reject non-image file uploads', fakeAsync(() => {
    // Simulate selecting a non-image file.
    const nonImageBlob = new Blob(['not-an-image'], { type: 'application/pdf' });
    const nonImageFile = new File([nonImageBlob], 'test-document.pdf', { type: 'application/pdf' });
    const nonImageFileList = { 0: nonImageFile, length: 1, item: (index: number) => nonImageFile };
  
    spyOnProperty(HTMLInputElement.prototype, 'files', 'get').and.returnValue(nonImageFileList);
  
    // Create and dispatch the simulated event.
    const event = new Event('change');
    Object.defineProperty(event, 'target', {value: {files: [nonImageFile]}, enumerable: true});
  
    component.onFileSelected(event);
  
    tick(); // Process the file selection.
  
    // The component should not accept the file, and an error message should be displayed.
    expect(component.selectedFile).toBeNull();
    expect(nzMessageService.error).toHaveBeenCalledWith("Invalid file format uploaded.");
  }));
  
});
