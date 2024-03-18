// userProfile.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Services/UserService/user.service';
import { User } from '../Models/User/user';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { AuthService } from '../Services/Auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SignalRService } from '../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId: number = 0;
  User = {} as User;
  editMode: boolean = false;
  showEditIcon: boolean = false;
  showModal: boolean = false;
  @Input() isCollapsed: boolean = false;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  originalProfileName: string = '';
  showDeleteConfirm = false;
  isUploading: boolean = false;

  constructor(
    private userService: UserService, 
    private router: Router,
    private lsService:LocalstorageService,
    private dsService:DataShareService,
    private authService: AuthService,
    private message: NzMessageService,
    private signalRService: SignalRService
  ) {
  }

  ngOnInit() {
    this.fetchUserData();
  }
  
  toggleEditMode() {
    if (!this.editMode) {
      this.originalProfileName = this.User.ProfileName;
    }
    this.editMode = !this.editMode;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
      if (fileList && fileList.length > 0) {
      const file = fileList[0];
  
      if (file.size > 7 * 1024 * 1024) {
        this.message.error("The file is too large. Please upload an image that is 7MB or smaller.");
        return;
      }
  
      if (this.isImage(file.name)) {
        if (this.previewImageUrl) {
          URL.revokeObjectURL(this.previewImageUrl);
          this.previewImageUrl = null;
        }
        // Validate if it's a real image
        const img = new Image();
        img.onload = () => {
          this.previewImageUrl = URL.createObjectURL(file);
          this.selectedFile = file; 
        };
        img.onerror = () => {
          this.message.error("The file is not a valid image.");
        };
        
        // Use FileReader to read the file for preview
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          img.src = e.target?.result as string; // Trigger load for validation
        };
        reader.readAsDataURL(file);
      } else {
        this.message.error("Invalid file format uploaded.");
      }
      // Clear the input to ensure change event fires even if the same file is selected again
      element.value = '';
    }
  }

  // onFileSelected(event: Event) {
  //   const element = event.currentTarget as HTMLInputElement;
  //   let fileList: FileList | null = element.files;
  //   if (fileList && fileList.length > 0) {
  //     const file = fileList[0];
  
  //     // Check if the file size is larger than 7MB (7 * 1024 * 1024 bytes)
  //     if (file.size > 7 * 1024 * 1024) {
  //       this.message.error("The file is too large. Please upload an image that is 7MB or smaller.");
  //       return; // Exit the function if the file is too large
  //     }
  
  //     if (this.isImage(file.name)) {
  //       // Use FileReader to read the file for preview
  //       const reader = new FileReader();
  //       reader.onload = (e: ProgressEvent<FileReader>) => {
  //         this.previewImageUrl = e.target?.result as string;
  //       };
  //       reader.readAsDataURL(file);
  //       this.selectedFile = file; // Set the selected file only if it's within the size limit
  //     } else {
  //       this.message.error("Invalid file format uploaded.");
  //     }
  //   }
  // }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|jfif|pjpeg|pjp|webp)$/i.test(fileName);
  }

  saveProfileName(): void {
    this.User.ProfileName = this.User.ProfileName.trim();

    if (this.User.ProfileName.length < 2) {
      this.message.error('Profile name must be at least 2 characters long.');
      return;
    }
    this.userService.updateProfileName(this.User.ProfileName).subscribe({
      next: () => {
        this.editMode = false;
        this.message.success('Profile name updated');
      },
      error: (error) => {
        console.error('Error updating profile name:', error);
      }
    });
  }

  saveProfilePicture(): void {
    if (this.selectedFile) {
      this.isUploading = true;
      this.userService.updateProfilePicture(this.selectedFile).subscribe({
        next: () => {
          this.User.ProfilePicture = this.previewImageUrl || 'default-profile-picture-url.png';
          this.previewImageUrl = null;
          this.showEditIcon = false;
          this.editMode = false;
          this.message.success('Profile picture updated');
          this.isUploading = false;
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          this.message.error('Error uploading file:');
          this.isUploading = false;
        }
      });
    }
  }

  fetchUserData(): void 
  {
    this.userService.getUserById().subscribe({
      next: (data) => {
        this.User = data;
        this.dsService.updateLoginUserPN(data.ProfileName);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  deleteAccount() {
    this.userService.deleteUser().subscribe({
      next: () => {

        this.showDeleteConfirm = false;

        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (e) => {
            this.message.error(e.error || 'Account deletion failed');
          }
        });
        this.message.success('Account Deleted');
      },
      error: error => {
        this.showDeleteConfirm = false;
        console.error('Error deleting account:', error);
      }
    });
    
  }
  
  cancelPreview() {
    this.previewImageUrl = null;
    
    this.selectedFile = null;
  }

  cancelEdit(): void {
    this.User.ProfileName = this.originalProfileName;
    this.editMode = false;
  }

  changePassword() {
    this.router.navigate(['/change-password'], { state: { userId: this.userId } });
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }
}
