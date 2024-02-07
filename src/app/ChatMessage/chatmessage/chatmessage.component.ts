import { Component, NgZone, OnInit } from '@angular/core';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../../Services/ShareDate/data-share.service';

@Component({
  selector: 'app-chatmessage',
  templateUrl: './chatmessage.component.html',
  styleUrl: './chatmessage.component.css'
})
export class ChatmessageComponent implements OnInit {

  constructor(private _dataShareService:DataShareService){}

  audioUrl: string = 'https://decchatroomb.blob.core.windows.net/chatroom/Messages/Audios/2024-02-02T14:19:21-voiceMessage.mp3';
  //uploadedFiles: File | null = null;
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  currentChatRoom = new ChatListVM();

  ngOnInit(){
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
    });
  }


  // onDragOver(event: Event): void {
  //   event.stopPropagation();
  //   event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
  // }

  // // This function is triggered when files are dropped in the drop zone
  // onDrop(event: DragEvent): void {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   this.handleFileInput(event.dataTransfer?.files || null);
  // }

  // handleFileInput(files: FileList | null): void {
  //   if (files && files[0]) {
  //     const file = files[0];
  //     // Optional: Check if the file is an image
  //     if (file.type.match(/image.*/)) {
  //       this.createImagePreview(file);
  //     }
  //   }
  // }

  // // This function is triggered when files are selected via the input
  // onFileSelected(event:Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.handleFileInput(input.files);
  // }

  // private createImagePreview(file: File): void {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     this.imageUrl = reader.result as string;
  //   };

  //   reader.onerror = (e) => {
  //     // Handle the error
  //     console.error('FileReader error', e);
  //   };
  //   reader.readAsDataURL(file);
  // }


}
