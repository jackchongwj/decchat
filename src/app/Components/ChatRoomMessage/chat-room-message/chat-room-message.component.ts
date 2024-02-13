import { Component, OnInit} from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { Message } from '../../../Models/Message/message';
import { MessageService } from '../../../Services/MessageService/message.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

interface TypingStatus{
  userName:string;
  isTyping:boolean;
}

@Component({
  selector: 'app-chat-room-message',
  templateUrl: './chat-room-message.component.html',
  styleUrl: './chat-room-message.component.css'
})
export class ChatRoomMessageComponent implements OnInit{

  constructor(
    private _dataShareService:DataShareService,
    private _messageService:MessageService,
    private _signalRService:SignalRService
  ){}
    
  currentChatRoom = new ChatListVM();
  currentUser = localStorage.getItem("userId");
  messageList : Message[] = [];
  isTyping: boolean = false;

  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  videoUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Videos/testvideo.mp4";
  docsUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Documents/testrun1233333333333333333333333333333333333333333333333333333333333333333333333333.docx";

  ngOnInit(){
    this._dataShareService.UserTyping.subscribe( typingStatus => {
      this.isTyping = typingStatus;
    });

    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
    });

    console.log("Test run chat room message");

    this.messageList = this._messageService.obtainDummyData();

    this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
      this.isTyping = status.isTyping;
    });

  }

  isUserSend(){
    
  }

  hasAttachment(message:Message):boolean{
    if(message.ResourceUrl != "" || message.ResourceUrl == null){
      return true;
    }
    else{
      return false;
    }
  }

  isMsgWithAttach(message:Message):boolean{
    if(this.hasAttachment(message) && message.Content != ""){
      return true;
    }
    else{
      return false;
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

  isAudio(fileName: string): boolean {
    return /\.(mp3)$/i.test(fileName);
  }

  playVideo():void{
    console.log("Attempting to open video:", this.videoUrl);
    window.open(this.videoUrl, '_blank');
  }

  openDocument(): void {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(this.docsUrl)}&embedded=true`
    window.open(viewerUrl, '_blank');
  }

  downloadDocument(): void {
    const a = document.createElement('a');
    a.href = this.docsUrl;
    a.download = 'aa'; // You can set the default file name here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
