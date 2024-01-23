import { Component, OnInit } from '@angular/core';
import { Console } from 'console';
import { Message } from '../../Models/Message/message';
import { MessageService } from '../../Services/MessageService/message.service';

@Component({
  selector: 'app-messagebox',
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.css'
})
export class MessageboxComponent implements OnInit{
  
  constructor(private _mService:MessageService){}
  
  messageText: string = '';
  sendCooldownOn:boolean = false;
  message = {} as Message;

  ngOnInit(): void {
    console.log("Ignore OnInit");
    
  }

  onSendMessage(): void {
    this.message.Content = this.messageText;
    this.message.UserChatRoomId = 1;
    this.message.ResourceUrl = null;
    this.message.MessageType = 1;
    this.message.IsDeleted = false;

    this._mService.sendMessage(this.message).subscribe({
      next: (res) => {
        console.log(res);

        // Limit message send rate
        this.sendCooldownOn = true; // Activate cooldown
        setTimeout(() => this.sendCooldownOn = false, 500); 

        this.messageText = '';
      },
      error: (e) => {
        console.error(e);
      }
    }); 
    
  }
}
