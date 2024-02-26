import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { MessageService } from '../../../Services/MessageService/message.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

interface TypingStatus{
  userName:string;
  isTyping:boolean;
}

@Component({
  selector: 'app-messagebox',
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.css'
})

export class MessageboxComponent implements OnInit, OnDestroy{
  
  constructor(
    private _mService:MessageService,
    private _sService:SignalRService,
    private _lsService:LocalstorageService,
    private _dataShareService:DataShareService){}

  // Current User
  userId:number = Number(this._lsService.getItem("userId"));
  currentUserChatRoomId:number = 0;
  currentChatRoom:number = 0;
  currentUserPN:string = "";

  // Limit Message Sending
  sendCooldownOn:boolean = false;
  previewVisible = false;

  // File Uploads
  uploadedFiles: File | null = null;
  previewFile: string = '';
  messageText: string = '';
  message = {} as ChatRoomMessages;

  // Voice Message
  isRecording:boolean = false;
  private chunks: BlobPart[] = [];
  mediaRecorder: MediaRecorder | null = null;
  recordingInProgress = new Subject<boolean>();

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe(data => {
      this.currentUserChatRoomId = data.UserChatRoomId;
      this.currentChatRoom = data.ChatRoomId;
    });

    this._dataShareService.LoginUserProfileName.subscribe( data => {
      this.currentUserPN = data;
    })
  }

  ngOnDestroy(): void {
    if (this.isRecording) {
      this.stopRecording();
    }
    
    // Release the media stream
    if (this.mediaRecorder && this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
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
    
    const maxSizeInMb = 8;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    if (input.files && input.files.length) {
      this.uploadedFiles = input.files[0];

      if(!(this.uploadedFiles.size>maxSizeInBytes))
      {
        if(this.uploadedFiles.type.startsWith('image/'))
        {
          this.resizeAndPreviewImage(this.uploadedFiles);
        }
        
        const reader = new FileReader();

        reader.onload = (e) => {
          //console.log(reader.result);
          this.previewFile = reader.result as string;
        };

        reader.readAsDataURL(this.uploadedFiles);
      }
      else
      {
        console.log("Invalid File Size, file too big");
        
      }
    }
  }

  onSendMessage(event?:Event): void {
    if (event) {
      event.preventDefault();
    }

    //share Data
    this._dataShareService.selectedChatRoomData.subscribe
    (
      data =>{
        this.currentUserChatRoomId = data.UserChatRoomId;
      }
    )
    
    this.message.Content = this.messageText;
    this.message.UserChatRoomId = this.currentUserChatRoomId;
    this.message.ResourceUrl = '';
    this.message.MessageType = 1;
    this.message.IsDeleted = false;
    this.message.ChatRoomId = this.currentChatRoom;
    this.message.UserId = this.userId;
    this.message.ProfileName = this.currentUserPN;

    // Create FormData and append message and file (if exists)
    const formData = new FormData();
    formData.append('message', JSON.stringify(this.message));
    
    if (this.uploadedFiles) {
      console.log(this.uploadedFiles);
        formData.append('file', this.uploadedFiles, this.uploadedFiles.name);
    }

    this._mService.sendMessage(formData).subscribe({
      next: (res:ChatRoomMessages) => {
        //this._sService.notifyMessage(res);
        // Limit message send rate
        this.sendCooldownOn = true; // Activate cooldown
        setTimeout(() => this.sendCooldownOn = false, 1000); 

        // Reset field
        this.resetInputField();
      },
      error: (e) => {
        console.error(e);
      }
    }); 

    // this._sService.notifyMessage(this.message);
  }

  private resizeAndPreviewImage(file: File): void 
  {
    // Define the maximum dimensions for the resized image
    const maxWidth = 720;
    const maxHeight = 720;

    // Create an image element
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Get the dimensions of the loaded image
      const originalWidth = img.width;
      const originalHeight = img.height;

      // Calculate the scaling factor to resize the image
      let scaleFactor = Math.min(maxWidth / originalWidth, maxHeight / originalHeight, 1); // Ensure it's not scaled up

      // Compute the new dimensions
      const newWidth = originalWidth * scaleFactor;
      const newHeight = originalHeight * scaleFactor;

      // Create a canvas to perform the resizing
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the resized image onto the canvas
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert the canvas content to a Blob
      canvas.toBlob((blob) => 
      {
        if (blob) {
          // Convert the Blob to a File object
          const resizedFile = new File([blob], file.name, { type: 'image/webp', lastModified: Date.now() });

          // Preview the resized image
          this.previewFile = URL.createObjectURL(resizedFile);

          // Update the uploadedFiles with the resized image
          this.uploadedFiles = resizedFile;
        }
      }, 'image/webp', 0.85); // Adjust the quality as needed
    };
  }

  removeFile(): void {
    this.uploadedFiles = null;
    this.previewFile = '';

    // Reset the file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ''; // Add this line
    }
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|jfif|pjpeg|pjp|webp)$/i.test(fileName);
  }
  
  isVideo(fileName: string): boolean {
    return /\.(mp4)$/i.test(fileName);
  }
  
  isDocument(fileName: string): boolean {
    return /\.(pdf|docx?|doc?|txt)$/i.test(fileName);
  }

  OnInputFocus(): void {
    this._sService.InformUserTyping(this.currentChatRoom, true, this.currentUserPN);
  }

  OnInputBlur(): void {
    this._sService.InformUserTyping(this.currentChatRoom, false, this.currentUserPN);
  }

  // Handle Event Show User Status = 1 After Refresh
  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this._sService.InformUserTyping(this.currentChatRoom, false, this.currentUserPN);
  }

  // Voice Message Recording Session
  startRecording(): void {
    this.isRecording = true;
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
      this.mediaRecorder.onstop = () => this.onRecordingStop();
      this.mediaRecorder.start();
    })
    .catch(error => {
      console.error('Error accessing media devices:', error);
    });
  }

  stopRecording(): void {
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    if (this.mediaRecorder && this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
  }

  private onRecordingStop(): void {
    const blob = new Blob(this.chunks, { type: 'audio/mp3'});
    this.chunks = [];

    this.uploadedFiles = new File([blob], 'voiceMessage.mp3', { type: 'audio/mp3' });
    this.onSendMessage();
  }

  private resetInputField():void{
    this.messageText = '';
    this.uploadedFiles = null;
    this.previewFile = '';

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  }

}
