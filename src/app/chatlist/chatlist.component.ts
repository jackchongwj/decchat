import { AfterViewInit, Component, inject, Inject, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../chatlist.service';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
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
  userId:number = 7;
  //userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  privateChat: ChatListVM[] = [];
  groupChat: ChatListVM[] = [];
  
  constructor(private chatlistService: ChatlistService, private lsService: LocalstorageService, private dataShareService: DataShareService) {}

  ngOnInit(): void {}

  getChatList(){
    if (!this.privateChat || this.privateChat.length === 0 || !this.groupChat || this.groupChat.length === 0)
    {
      this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
        tap(), 
      ).subscribe((chats: ChatListVM[]) => {
        console.log()
        this.privateChat = chats.filter(chat => chat.RoomType === false);
        this.groupChat = chats.filter(chat => chat.RoomType === true);

        this.dataShareService.updateChatListData(chats);
      });
    }
  }

  getSelectedChatRoom(ChatRoom:ChatListVM)
  {
    this.dataShareService.updateSelectedChatRoom(ChatRoom);
    console.log(ChatRoom);
    //console.log(this.lsService.getItem("userId"));
  }  
  
}
