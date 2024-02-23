import { Component, inject, Inject, Input, OnInit, NgZone } from '@angular/core';
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
  privateChat: ChatListVM[] = [];
  groupChat: ChatListVM[] = [];
  userId: number = parseInt(this.localStorage.getItem('userId') || '');
  isSelectedData: boolean = false;

  constructor(
    private dataShareService: DataShareService,
    private signalRService: SignalRService,
    private localStorage: LocalstorageService,
    private ngZone: NgZone 
    ) {}

  ngOnInit(): void {
    this.getChatList();
  }

  getChatList(){
    // Create a Group instance with the userId
    if (this.privateChat.length === 0 && this.groupChat.length === 0)
    {
      this.RetrieveChatlist();
      this.UpdatePrivateChatList();
      this.UpdateDeletePrivateChatlist();
    }

  }

  getSelectedChatRoom(ChatRoom:ChatListVM)
  {
    this.dataShareService.updateSelectedChatRoom(ChatRoom);
  }  
  

  private UpdatePrivateChatList(): void {
    this.signalRService.updatePrivateChatlist()
      .subscribe((chatlist: ChatListVM) => {
        console.log("Plist",chatlist)
        this.privateChat.push(chatlist);
        console.log('Received updated private ChatList:', this.privateChat);
      });
  }

  private UpdateDeletePrivateChatlist(): void {
    this.signalRService.DelteFriend()
      .subscribe((userId: number) => {
        console.log("p", this.privateChat);
        console.log("Delete {userId}",userId);
        this.privateChat = this.privateChat.filter(chat => chat.UserId != userId);
        this.dataShareService.clearSelectedChatRoom(this.isSelectedData);
        console.log('Received updated private ChatList:', this.privateChat);
      });
  }

  private RetrieveChatlist() : void
  {
    this.signalRService.retrieveChatlistListener()
    .subscribe((chats: ChatListVM[]) => {
      console.log("Reach component retrieve chat list");
      this.privateChat = chats.filter(chat => chat.RoomType === false);
      this.groupChat = chats.filter(chat => chat.RoomType === true); 
    });
  }

}