import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { Group } from '../Models/DTO/Group/group';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})

export class ChatlistComponent implements OnInit{
  @Input() isCollapsed : boolean = false;
  showChatList = false;
  userId = 7;
  privateChat: any[] = [];
  groupChat: any[] = [];

  constructor(private chatlistService: ChatlistService) {}

  ngOnInit(): void {

    // Create a Group instance with the userId
    const group = new Group('', [], 0, this.userId); // Assuming other parameters are not relevant here

    this.chatlistService.getChatListByUserId(group).pipe(
      tap(chats => console.log(chats)), 
    ).subscribe((chats: any[]) => {
      
      this.privateChat = chats.filter(chat => chat.roomType === false);
      console.log(this.privateChat);
      this.groupChat = chats.filter(chat => chat.roomType === true);
      console.log(this.groupChat);  
    });
  }
}
