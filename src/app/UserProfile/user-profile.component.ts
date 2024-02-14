// userProfile.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Services/UserService/user.service';
import { User } from '../Models/User/user';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId: number;
  User = {} as User;
  editMode: boolean = false;
  showEditIcon: boolean = false;
  showModal: boolean = false;
  
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  showDeleteConfirm = false;


  constructor(
    private userService: UserService, 
    private router: Router
  ) {
      this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
  }

  ngOnInit() {
    console.log('Opening user profile modal for user ID:', this.userId);
    this.fetchUserData();
    console.log('userdetails',this.fetchUserData());
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
  
      // Use FileReader to read the file for preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImageUrl = e.target?.result as string; 
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProfileName(): void { 
    this.userService.updateProfileName(this.userId, this.User.ProfileName).subscribe({
      next: () => {
        console.log('Profile name updated successfully');
        this.fetchUserData(); // Refresh user data
        this.editMode = false; // Exit edit mode
        console.log("name edit",this.editMode);
      },
      error: (error) => {
        console.error('Error updating profile name:', error);
      }
    });
  }
  
  saveProfilePicture() {
    if (this.selectedFile && this.userId) {
      this.userService.updateProfilePicture(this.userId, this.selectedFile).subscribe({
        next: (event) => {
          this.User.ProfilePicture = this.previewImageUrl || 'default-profile-picture-url.png'; // Update the main profile picture URL
          this.previewImageUrl = null; // Clear the preview
          this.showEditIcon = false; // Hide the edit icon
          this.editMode = false; // Exit edit mode, ensuring a smooth user experience
        },
        error: (error) => {
          console.error('Error uploading file:', error);
        }
      });
    }
  }

fetchUserData(): void {
  if (!this.userId) {
    console.log('User ID not set');
    return;
  }

  this.userService.getUserById(this.userId).subscribe({
    next: (data) => {
      console.log('Fetched user data:', data);
      this.User = data;
      console.log('USER',this.User);
    },
    error: (error) => {
      console.error('Error fetching user data:', error);
    }
  });
}

deleteAccount() {
  // Use your userService to delete the account
  this.userService.deleteUser(this.userId).subscribe({
    next: () => {
      this.showDeleteConfirm = false; // Close the modal on success
      this.router.navigate(['/login']); // Redirect or handle as needed
    },
    error: error => {
      this.showDeleteConfirm = false; // Close the modal on error
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
