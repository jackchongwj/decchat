import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';
import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { MessageService } from '../../../Services/MessageService/message.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

interface TypingStatus {
  userName: string;
  isTyping: boolean;
}

@Component({
  selector: 'app-messagebox',
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.css'
})

export class MessageboxComponent implements OnInit, OnDestroy {

  constructor(
    private _mService: MessageService,
    private _sService: SignalRService,
    private _lsService: LocalstorageService,
    private _dataShareService: DataShareService,
    private _msgBox: NzMessageService) { }

  // Current User
  userId: number = Number(this._lsService.getItem("userId"));
  currentUserChatRoomId: number = 0;
  currentChatRoom: number = 0;
  currentUserPN: string = "";

  // Limit Message Sending
  sendCooldownOn: boolean = false;
  previewVisible = false;
  isSending: boolean = false;

  // File Uploads
  uploadedFiles: File | null = null;
  previewFile: string = '';
  messageText: string = '';
  message = {} as ChatRoomMessages;

  // Voice Message
  isRecording: boolean = false;
  private chunks: BlobPart[] = [];
  mediaRecorder: MediaRecorder | null = null;
  recordingInProgress = new Subject<boolean>();

  ngOnInit(): void {

    this.GetChatRoomData();

    this._dataShareService.LoginUserProfileName.subscribe(data => {
      this.currentUserPN = data;
    })

    this.updateMessageListenerListener();
    this.InvalidUploadListener();
  }

  //data share 
  //chatroom data 
  GetChatRoomData(): void {
    this._dataShareService.selectedChatRoomData.subscribe(data => {
      this.currentUserChatRoomId = data.UserChatRoomId;
      this.currentChatRoom = data.ChatRoomId;
    });
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
      this._msgBox.error("The file input element was not found!");
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const maxSizeInMb = 8;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    if (input.files && input.files.length) {
      this.uploadedFiles = input.files[0];

      if (!(this.uploadedFiles.size > maxSizeInBytes)) {
        if (this.uploadedFiles.type.startsWith('image/')) {
          this.resizeAndPreviewImage(this.uploadedFiles);
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          this.previewFile = reader.result as string;
        };

        reader.readAsDataURL(this.uploadedFiles);
      }
      else {
        this._msgBox.error("File upload failed: The selected file exceeds the maximum allowed size of 8MB. Please choose a smaller file.");
        this.removeFile();
      }
    }
  }

  //send message
  onSendMessage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (!this.uploadedFiles && this.messageText.trim().length == 0) {
      this._msgBox.error("Please enter a message");
      this.resetInputField();
      return;
    }

    this.message.Content = this.messageText;
    this.message.UserChatRoomId = this.currentUserChatRoomId;
    this.message.ResourceUrl = '';
    this.message.IsDeleted = false;
    this.message.ChatRoomId = this.currentChatRoom;
    this.message.UserId = this.userId;
    this.message.ProfileName = this.currentUserPN;

    // Create FormData and append message and file (if exists)
    const formData = new FormData();

    if (this.uploadedFiles) {
      formData.append('file', this.uploadedFiles, this.uploadedFiles.name);
    }
    formData.append('message', JSON.stringify(this.message));

    this.isSending = true;

    // HTTP Client
    this._mService.sendMessage(formData).subscribe({
      next: (res: ChatRoomMessages) => {

        // Limit message send rate
        this.sendCooldownOn = true; // Activate cooldown
        setTimeout(() => this.sendCooldownOn = false, 1000);

        // Reset field
        this.resetInputField();
      },
      error: (e) => {
        this.isSending = false;
      }
    });

  }

  private resizeAndPreviewImage(file: File): void {
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
      canvas.toBlob((blob) => {
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
    // Get Permission for audio input (Microphone)
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      // Event handler
      this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
      // Call when stop recording
      this.mediaRecorder.onstop = () => this.onRecordingStop();
      // Start capture
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
    const blob = new Blob(this.chunks, { type: 'audio/mp3' });
    this.chunks = [];

    this.uploadedFiles = new File([blob], 'voiceMessage.mp3', { type: 'audio/mp3' });
    this.onSendMessage();
  }

  private resetInputField(): void {
    this.messageText = '';
    this.uploadedFiles = null;
    this.previewFile = '';

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  //update message signalR
  private updateMessageListenerListener(): void {
    this._sService.updateMessageListener()
      .subscribe((newResults: ChatRoomMessages) => {
        this.isSending = false;
      });
  }

  private InvalidUploadListener():void{
    this._sService.invalidFormatUpload()
    .subscribe((senderId) => {
      if(senderId == this.userId)
      {
        this.isSending = false;
        this._msgBox.error("Invalid File Format Uploaded");
      }
    });
  }

}
