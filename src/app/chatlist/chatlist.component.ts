import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../chatlist.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';

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

  constructor(private chatlistService: ChatlistService, private dataShareService: DataShareService) {}

  ngOnInit(): void {
    this.chatlistService.getChatListByUserId(this.userId).pipe(
      tap(chats => console.log(chats)), 
    ).subscribe((chats: ChatListVM[]) => {
      
      this.privateChat = chats.filter(chat => chat.RoomType === false);
      this.groupChat = chats.filter(chat => chat.RoomType === true);  

      // this.privateChat = chats.RoomType === false ? [chats] : [];
      // this.groupChat = chats.RoomType === true ? [chats] : [];  

      console.log("privateGrouplist", chats);
      this.dataShareService.updateChatListData(chats);
  });
}
}
