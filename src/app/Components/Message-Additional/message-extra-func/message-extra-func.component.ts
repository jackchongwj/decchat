import { Component, Input, OnInit } from '@angular/core';
import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';
import { EditMessage } from '../../../Models/DTO/EditMessage/edit-message';
import { MessageService } from '../../../Services/MessageService/message.service';

@Component({
  selector: 'app-message-extra-func',
  templateUrl: './message-extra-func.component.html',
  styleUrl: './message-extra-func.component.css'
})
export class MessageExtraFuncComponent implements OnInit {

  @Input() messageData = {} as ChatRoomMessages;

  editIsVisible: boolean = false;
  deleteIsVisible: boolean = false;

  newMessageContent: string = '';

  constructor(
    private _mService: MessageService
  ) { }

  ngOnInit(): void {
    this.newMessageContent = this.messageData.Content;
  }

  OpenEditMessage() {
    this.editIsVisible = true;
  }

  handleEditModalCancel() {
    this.editIsVisible = false;
  }

  handleEditModalOk() {
    this.editIsVisible = false;
    if (this.newMessageContent != this.messageData.Content) {

      const editMessage: EditMessage =
      {
        ChatRoomId: this.messageData.ChatRoomId,
        Content: this.messageData.Content,
        MessageId: this.messageData.MessageId
      }

      console.log("ed", editMessage)
      editMessage.Content = this.newMessageContent;

      this._mService.editMessage(editMessage).subscribe({
        next: (res: EditMessage) => {
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  OpenDeleteMessage() {
    this.deleteIsVisible = true;
  }

  handleDeleteModalCancel() {
    this.deleteIsVisible = false;
  }

  handleDeleteModalOk() {
    this.deleteIsVisible = false;

    this._mService.deleteMessage(this.messageData.MessageId!, this.messageData.ChatRoomId).subscribe({
      next: (res: number) => {
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
}
