import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { Group } from '../Models/DTO/Group/group';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';


@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})

export class ChatlistComponent implements OnInit{
  @Input() isCollapsed : boolean = false;
  showChatList = false;
  // userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  privateChat: any[] = [];
  groupChat: any[] = [];
  
  constructor(private chatlistService: ChatlistService, private lsService: LocalstorageService, private dataShareService: DataShareService,
    private signalRService: SignalRService, private localStorage: LocalstorageService) {}

    private userId: number = parseInt(this.localStorage.getItem('userId') || '');
    
  ngOnInit(): void {}

  getChatList(){

    // Create a Group instance with the userId
    const group = new Group('', [], 0, this.userId); // Assuming other parameters are not relevant here

    if (!this.privateChat || this.privateChat.length === 0 || !this.groupChat || this.groupChat.length === 0)
    {
      this.chatlistService.getChatListByUserId(group).pipe(
        tap(chats => console.log(chats)), 
      ).subscribe((chats: ChatListVM[]) => {
        
        this.privateChat = chats.filter(chat => chat.RoomType === false);
        console.log(this.privateChat);
        this.groupChat = chats.filter(chat => chat.RoomType === true);
        console.log(this.groupChat);  

        console.log("privateGrouplist", chats);
        // this.dataShareService.updateChatListData(chats);
        this.signalRService.AddToGroup(chats);
      });
    }
  }

  getSelectedChatRoom(chatRoomId:number)
  {
        console.log(this.lsService.getItem("userId"));
  }  
  
}
