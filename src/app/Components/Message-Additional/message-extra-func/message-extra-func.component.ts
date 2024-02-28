import { Component, Input, OnInit } from '@angular/core';
import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';
import { MessageService } from '../../../Services/MessageService/message.service';

@Component({
  selector: 'app-message-extra-func',
  templateUrl: './message-extra-func.component.html',
  styleUrl: './message-extra-func.component.css'
})
export class MessageExtraFuncComponent implements OnInit{

  @Input() messageData = {} as ChatRoomMessages;

  editIsVisible:boolean = false;
  deleteIsVisible:boolean = false;

  newMessageContent:string = '';

  constructor(
    private _mService:MessageService
  ) {}

  ngOnInit(): void {
    this.newMessageContent = this.messageData.Content;
  }

  OpenEditMessage(){
    this.editIsVisible = true;
  }

  handleEditModalCancel(){
    this.editIsVisible = false;
  }

  handleEditModalOk(){
    this.editIsVisible = false;
    if(this.newMessageContent != this.messageData.Content)
    {
      this.messageData.Content = this.newMessageContent;

      this._mService.editMessage(this.messageData).subscribe({
        next: (res:ChatRoomMessages) => {
          console.log("Success edit msg: ", res);
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  OpenDeleteMessage(){
    this.deleteIsVisible = true;
  }

  handleDeleteModalCancel(){
    this.deleteIsVisible = false;
  }

  handleDeleteModalOk(){
    this.deleteIsVisible = false;

    this._mService.deleteMessage(this.messageData.MessageId!, this.messageData.ChatRoomId).subscribe({
      next: (res:number) => {
        console.log(res);
      },
      error: (e) => {
        console.error(e);
      }
    }); 
  }
}
