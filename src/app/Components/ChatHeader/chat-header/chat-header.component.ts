import { Component, OnInit } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { TypingStatus } from '../../../Models/DTO/TypingStatus/typing-status';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';
import { ChatroomService } from '../../../Services/ChatroomService/chatroom.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent implements OnInit{

  constructor(
    private _dataShareService:DataShareService,
    private _signalRService:SignalRService,
    private _chatRoomService:ChatroomService
    ){}
    
  currentChatRoom = {} as ChatListVM;
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  IsCurrentChatUser: boolean = false;
  showDropdown: boolean = false;
  editMode: boolean = false;
  showEditIcon: boolean = false;
  showModal: boolean = false;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
      this.IsCurrentChatUser = false;
    });

    console.log("chatroom details", this.currentChatRoom);
    this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
      if(status.isTyping && status.ChatRoomId == this.currentChatRoom.ChatRoomId)
      {
        this.IsCurrentChatUser = true;
      }
      else{
        this.IsCurrentChatUser = false;
      }
      
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown; // Toggle the visibility of the dropdown
  }

  saveGroupName(): void {
    this._chatRoomService.updateGroupName(this.currentChatRoom.ChatRoomId, this.currentChatRoom.ChatRoomName).subscribe({
      next: () => {
        this.editMode = false; // Exit edit mode
      },
      error: (error) => {
        console.error('Error updating profile name:', error);
      }
    });
  }

  saveProfilePicture(): void {
    if (this.selectedFile && this.currentChatRoom.ChatRoomId) {
      this._chatRoomService.updateGroupPicture(this.currentChatRoom.ChatRoomId, this.selectedFile).subscribe({
        next: () => {
          this.currentChatRoom.ProfilePicture = this.previewImageUrl || 'default-profile-picture-url.png';
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

  cancelPreview() {
    this.previewImageUrl = null;
    
    this.selectedFile = null;
  }

  cancelEdit(): void {
    this.editMode = false;
  }  

  toggleModal(): void {
    this.showModal = !this.showModal;
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

}
