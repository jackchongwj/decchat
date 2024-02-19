import { Component, OnInit, NgZone } from '@angular/core';
import { response } from 'express';
import { Message } from '../../Models/Message/message';
import { Messages } from '../../Models/DTO/Messages/messages';
import { MessageService } from '../../Services/MessageService/message.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';
import { User } from '../../Models/User/user';

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
    private _signalRService:SignalRService,
    private ngZone: NgZone
  ){}
  
  
  //share data
  ChatRoomId: number = 0;

  messageList : Messages[] = [];
  isTyping: boolean = false;
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";

  ngOnInit(){
    this._dataShareService.UserTyping.subscribe( typingStatus => {
      this.isTyping = typingStatus;
    });


      //share Data
      this._dataShareService.selectedChatRoomData.subscribe(data => {
        console.log("chatlist Data", data);
        this.ChatRoomId = data.ChatRoomId;
        console.log("chatroom id", data.ChatRoomId);

        //service
        this._messageService.getMessage(this.ChatRoomId).subscribe(response => {
          console.log("response", response);
          this.messageList = response;
          console.log("messageList", this.messageList);
        }, error => {
          console.error('Error fetching messages:', error);
        });
      });

    // this.messageList = this._messageService.obtainDummyData();
    // this.messageList = this._messageService.obtainDummyData();


    this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
      this.isTyping = status.isTyping;
    });

     this.updateMessageListenerListener();
  }

    //signalR
    private updateMessageListenerListener(): void {
      console.log("------------")
      this._signalRService.updateMessageListener()
        .subscribe((newResults: Messages) => {
          console.log("messageList", this.messageList);
          console.log("cid", newResults.ChatRoomId)
          const UserChatRoomId = this.messageList[0].ChatRoomId;
          console.log("result", UserChatRoomId);

          if(newResults.ChatRoomId == UserChatRoomId)
          {
            this.messageList = this.messageList.concat(newResults);
            console.log("new",this.messageList)
          }

          console.log("new result", newResults);
          console.log('Received updated message results:', this.messageList);
        });
    }


}

