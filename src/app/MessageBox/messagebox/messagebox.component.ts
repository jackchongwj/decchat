import { Component, OnInit } from '@angular/core';
import { Message } from '../../Models/Message/message';
import { MessageService } from '../../Services/MessageService/message.service';

@Component({
  selector: 'app-messagebox',
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.css'
})

export class MessageboxComponent implements OnInit{

  sendCooldownOn:boolean = false;
  previewVisible = false;

  previewImage: string | undefined = '';
  messageText: string = '';
  url: string = '';
  message = {} as Message;
  uploadedFiles: File | null = null;

  constructor(private _mService:MessageService){}
  
  ngOnInit(): void {
    console.log("Ignore OnInit");
  }

  triggerFileInput(): void {
    const fileInput: HTMLElement | null = document.getElementById('fileInput');

    if (fileInput) {
      fileInput.click();
    } else {
      console.error('The file input element was not found!');
    }
  }

  onFileSelected(event:Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      this.uploadedFiles = input.files[0];

      const reader = new FileReader();

      reader.onload = (e) => {
        console.log(reader.result);

        this.previewImage = reader.result as string;
      };

      reader.readAsDataURL(this.uploadedFiles);
     }
  }

  onSendMessage(event:Event): void {
    event.preventDefault();

    this.message.Content = this.messageText;
    this.message.UserChatRoomId = 1;
    this.message.ResourceUrl = this.url;
    this.message.MessageType = 1;
    this.message.IsDeleted = false;

    console.log(this.message);

    // Create FormData and append message and file (if exists)
    const formData = new FormData();
    formData.append('message', JSON.stringify(this.message));
    
    if (this.uploadedFiles) {
        formData.append('file', this.uploadedFiles, this.uploadedFiles.name);
    }

    this._mService.sendMessage(formData).subscribe({
      next: (res) => {
        console.log(res);

        // Limit message send rate
        this.sendCooldownOn = true; // Activate cooldown
        setTimeout(() => this.sendCooldownOn = false, 1000); 

        this.messageText = '';
        this.uploadedFiles = null;
        this.previewImage = undefined;
      },
      error: (e) => {
        console.error(e);
      }
    }); 
  }

  removeFile(): void {
    this.uploadedFiles = null;
    this.previewImage = undefined;
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|jfif|pjpeg|pjp|webp)$/i.test(fileName);
  }
  
  isVideo(fileName: string): boolean {
    return /\.(mp4|mkv)$/i.test(fileName);
  }
  
  isDocument(fileName: string): boolean {
    return /\.(pdf|docx?|doc?|txt)$/i.test(fileName);
  }

}
