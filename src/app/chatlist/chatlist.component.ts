import { AfterViewInit, Component, inject, Inject, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../chatlist.service';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';

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
  
  constructor(private chatlistService: ChatlistService, private lsService: LocalstorageService) {}

  ngOnInit(): void {
  }

  getChatList(){
    if (!this.privateChat || this.privateChat.length === 0 || !this.groupChat || this.groupChat.length === 0)
    {
      this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
        tap(chats => console.log(chats)), 
      ).subscribe((chats: any[]) => {
        
        this.privateChat = chats.filter(chat => chat.roomType === false);
        console.log(this.privateChat);
        this.groupChat = chats.filter(chat => chat.roomType === true);
        console.log(this.groupChat);  
      });
    }
  }  

  getSelectedChatRoom(chatRoomId:number)
  {
    
    console.log(this.lsService.getItem("userId"));
  }
}
