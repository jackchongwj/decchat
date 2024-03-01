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
  
  showDeleteConfirm = false;

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
    this.userId = parseInt(this.lsService.getItem('userId') || '0', 10);
    this.fetchUserData();
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];

      if(this.isImage(this.selectedFile.name))
      {
        // Use FileReader to read the file for preview
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.previewImageUrl = e.target?.result as string; 
        };
        reader.readAsDataURL(this.selectedFile);
      }
      else
      {
        this.message.error("Invalid File Format Uploaded");
      }
   
    }
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|jfif|pjpeg|pjp|webp)$/i.test(fileName);
  }

  saveProfileName(): void {
    this.userService.updateProfileName(this.userId, this.User.ProfileName).subscribe({
      next: () => {
        this.editMode = false; // Exit edit mode
      },
      error: (error) => {
        console.error('Error updating profile name:', error);
      }
    });
  }

  saveProfilePicture(): void {
    if (this.selectedFile && this.userId) {
      this.userService.updateProfilePicture(this.userId, this.selectedFile).subscribe({
        next: () => {
          this.User.ProfilePicture = this.previewImageUrl || 'default-profile-picture-url.png';
          this.previewImageUrl = null;
          this.showEditIcon = false;
          this.editMode = false;
        },
        error: (error) => {
          console.error('Error uploading file:', error);
        }
      });
    }
  }

  fetchUserData(): void 
  {
    if (!this.userId) {
      return;
    }

    this.userService.getUserById(this.userId).subscribe({
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
    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
<<<<<<< HEAD
        this.showDeleteConfirm = false;
=======

        this.showDeleteConfirm = false;

>>>>>>> origin
        this.authService.logout().subscribe({
          next: (res) => {
            this.router.navigate(['/login']);
          },
          error: (e) => {
<<<<<<< HEAD
            console.error('Account deletion failed', e);
=======
>>>>>>> origin
            this.message.error(e.error.Error || 'Account deletion failed');
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
    this.editMode = false;
  }  

  changePassword() {
    this.router.navigate(['/change-password'], { state: { userId: this.userId } });
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }
}
