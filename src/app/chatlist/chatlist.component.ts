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
  userId:number = 7;
  //userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  privateChat: ChatListVM[] = [];
  groupChat: ChatListVM[] = [];
  
  constructor(private chatlistService: ChatlistService, private lsService: LocalstorageService, private dataShareService: DataShareService,
    private signalRService: SignalRService, private localStorage: LocalstorageService) {}

  public userId: number = parseInt(this.localStorage.getItem('userId') || '');
    
  ngOnInit(): void {
    // this.getChatList();
  }

  getChatList(){

    // Create a Group instance with the userId
    const group = new Group('', [], 0, this.userId); // Assuming other parameters are not relevant here

    if (!this.privateChat || this.privateChat.length === 0 || !this.groupChat || this.groupChat.length === 0)
    {
      this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
        tap(), 
      ).subscribe((chats: ChatListVM[]) => {
        console.log("sr")
        this.signalRService.AddToGroup(chats);        
        console.log("Success Add To Group")

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
