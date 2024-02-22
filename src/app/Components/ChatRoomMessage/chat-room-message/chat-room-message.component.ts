import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { ChatRoomMessages } from '../../../Models/DTO/Messages/chatroommessages';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { MessageService } from '../../../Services/MessageService/message.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-chat-room-message',
  templateUrl: './chat-room-message.component.html',
  styleUrl: './chat-room-message.component.css'
})
export class ChatRoomMessageComponent implements OnInit, AfterViewChecked {
  
  @ViewChild('scroll') myScrollContainer !: ElementRef;

  constructor(
    private _dataShareService:DataShareService,
    private _messageService:MessageService,
    private _signalRService:SignalRService,
    private lsService:LocalstorageService,
    private ngZone: NgZone
  ){}
    
  currentChatRoom = {} as ChatListVM;
  currentUser = Number(this.lsService.getItem("userId"));
  messageList : ChatRoomMessages[] = [];

  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  videoUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Videos/testvideo.mp4";
  docsUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Documents/testrun1233333333333333333333333333333333333333333333333333333333333333333333333333.docx";

  ngOnInit(){

    // Get Chosen Chat Room
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;

      // HTTP Get Message Service\
      this.retrieveMessage(this.currentChatRoom.ChatRoomId)

    });

    this.updateMessageListenerListener();
  }

  
  ngAfterViewChecked(): void {
    
  }

  public scrollLast(): void {
    // Use setTimeout to ensure the DOM has been updated
    setTimeout(() => {
      const lastElement = this.myScrollContainer.nativeElement.lastElementChild;
      lastElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }

  isUserSend(message:ChatRoomMessages):boolean{
    if(message.UserId == this.currentUser)
    {
      return true;
    }
    else{
      return false;
    }
  }

  isPureMessage(message:ChatRoomMessages):boolean{
    return message.ResourceUrl == '' && message.ResourceUrl == null ? true : false;
  }

  hasMessage(message:ChatRoomMessages):boolean{
    console.log("Message Context: ", message.Content);
    return message.Content != '' || message.Content != null ? true : false;
  }

  isImage(fileName: ChatRoomMessages): boolean {
    return /\.(jpg|jpeg|png|jfif|pjpeg|pjp|webp)$/i.test(fileName.ResourceUrl);
  }
  
  isVideo(fileName: ChatRoomMessages): boolean {
    return /\.(mp4)$/i.test(fileName.ResourceUrl);
  }

  getFileNameFromUrl(url:string){
    // Decode URI to handle encoded characters (%20 = space, etc)
    const decodedUrl = decodeURIComponent(url);

    // Create a URL object (assuming url is absolute)
    const parsedUrl = new URL(decodedUrl);

    // Get the pathname by split '/'
    const segments = parsedUrl.pathname.split('/');

    // Take last segment (Date-filename)
    const lastSegment = segments.pop() || '';
    
    // Take filename
    const fileName = lastSegment.split('-').pop();

    return fileName || '';
  }
  
  isDocument(fileName: ChatRoomMessages): boolean {
    return /\.(pdf|docx?|doc?|txt)$/i.test(fileName.ResourceUrl);
  }

  isAudio(fileName: ChatRoomMessages): boolean {
    return /\.(mp3)$/i.test(fileName.ResourceUrl);
  }

  playVideo(data:ChatRoomMessages):void{
    window.open(data.ResourceUrl, '_blank');
  }

  openDocument(message:ChatRoomMessages): void {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(message.ResourceUrl)}&embedded=true`
    window.open(viewerUrl, '_blank');
  }

  downloadDocument(message:ChatRoomMessages): void {
    const a = document.createElement('a');
    a.href = message.ResourceUrl;
    const filename = this.getFileNameFromUrl(message.ResourceUrl);
    a.download = filename; 
    console.log("Docs File Name: ", a.download);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  transformDate(date:string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd HH:mm');
  }

  private updateMessageListenerListener(): void {
    console.log("------------")
    this._signalRService.updateMessageListener()
      .subscribe((newResults: ChatRoomMessages) => {
        console.log("messageList", this.messageList);
        console.log("cid", newResults.ChatRoomId)
        console.log("result", this.currentChatRoom.ChatRoomId);
        
        if(newResults.ChatRoomId == this.currentChatRoom.ChatRoomId)
        {
           this.messageList.push(newResults);
          console.log("new",this.messageList)
        }
      });
  }

  private retrieveMessage(chatroomId: number): void
  {
    this._messageService.getMessage(chatroomId).subscribe(response => {
      this.messageList = response;
      this.scrollLast();

      console.log("Obtained messageList", this.messageList);
    }, error => {
      console.error('Error fetching messages:', error);
    });
  }

}
