import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Message } from '../../Models/Message/message';
import { MessageService } from '../../Services/MessageService/message.service';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';
import { Observable, Subject } from 'rxjs';

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

  // Limit Message Sending
  sendCooldownOn:boolean = false;
  previewVisible = false;

  // Show User Typing Status
  userActive:boolean = false;

  // File Uploads
  uploadedFiles: File | null = null;
  previewFile: string = '';
  messageText: string = '';
  message = {} as Message;
  
  // Voice Message
  isRecording:boolean = false;
  private chunks: BlobPart[] = [];
  mediaRecorder: MediaRecorder | null = null;
  audioUrl: SafeUrl | null = null;
  recordingInProgress = new Subject<boolean>();

  constructor(private _mService:MessageService, private _sService:SignalRService, private sanitizer: DomSanitizer){}
  
  ngOnInit(): void {
    console.log("Ignore OnInit");
    navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const mics = devices.filter(device => device.kind === 'audioinput');
    if (mics.length) {
      console.log('Microphones found:', mics);
    } else {
      console.log('No microphones found, or the browser is not accessing them.');
    }
  })
  .catch(err => console.error('Error enumerating devices:', err));
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

  onSendMessage(event:Event): void {
    event.preventDefault();

    this.message.Content = this.messageText;
    this.message.UserChatRoomId = 1;
    this.message.ResourceUrl = '';
    this.message.MessageType = 1;
    this.message.IsDeleted = false;

    //console.log(this.message);

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

        // Reset field
        this.messageText = '';
        this.uploadedFiles = null;
        this.previewFile = '';
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ''; // Add this line
        }
      },
      error: (e) => {
        console.error(e);
      }
    }); 
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
    return /\.(mp4|mkv)$/i.test(fileName);
  }
  
  isDocument(fileName: string): boolean {
    return /\.(pdf|docx?|doc?|txt)$/i.test(fileName);
  }

  OnInputFocus(): void {
    this._sService.InformUserTyping("Alice", true);
    this._sService.UserTypingStatus().subscribe((status:TypingStatus) => {
      console.log(`${status.userName} is typing: ${status.isTyping}`);
      this.userActive = status.isTyping;
    });
    
  }

  OnInputBlur(): void {
    this._sService.InformUserTyping("Alice", false);
    this._sService.UserTypingStatus().subscribe((status:TypingStatus) => {
      console.log(`${status.userName} is typing: ${status.isTyping}`);
      this.userActive = status.isTyping;
    });
  }

  // Voice Message Recording Session
  startRecording(): void {
    console.log("Recording start");
    this.isRecording = true;
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      if(stream.getAudioTracks().length > 0) {
        console.log('Audio tracks:', stream.getAudioTracks());
      }
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
    console.log("Recording stop");
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  private onRecordingStop(): void {
    const blob = new Blob(this.chunks, { type: 'audio/mp3'});
    this.chunks = [];

    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger a download
    // const a = document.createElement('a');
    // document.body.appendChild(a);
    // a.style.display = 'none';
    // a.href = url;
    // a.download = 'recording.mp3'; // Specify the name of the file to be downloaded
    // a.click();

    // // Clean up by revoking the object URL and removing the anchor element
    // URL.revokeObjectURL(url);
    // a.remove();
    
    // Optional: If you want to keep the URL for playing it back in the UI
    this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(url);

    console.log('Recording stopped and file saved.');
    if (this.mediaRecorder && this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  
    console.log('Recording stopped, file saved, and media stream released.');
    }
}
