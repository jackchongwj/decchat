import { AfterViewInit, Component, inject, Inject, Input, OnInit, NgZone } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../../app/Services/Chatlist/chatlist.service';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { Group } from '../Models/DTO/Group/group';

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
  // userId = 7;

  constructor(
    private chatlistService: ChatlistService,
    private lsService: LocalstorageService,
    private dataShareService: DataShareService,
    private signalRService: SignalRService,
    private localStorage: LocalstorageService,
    private signalRFService: SignalRFriendService,
    private ngZone: NgZone 
    ) {}

  ngOnInit(): void {
    // this.signalRService.addNewGroupListener().subscribe(chatListVM => {
    //   console.log('Received new group :', chatListVM);
    //   // Add the new room to the groupChat array
    //   this.groupChat.push(chatListVM);

    // });
    this.getChatList();
  }

    getChatList(){
      // Create a Group instance with the userId
      if (this.privateChat.length === 0 && this.groupChat.length === 0)
      {
        console.log(this.userId);
        this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
          tap(), 
        ).subscribe((chats: ChatListVM[]) => {
          
          this.privateChat = chats.filter(chat => chat.RoomType === false);
          console.log(this.privateChat);
          this.groupChat = chats.filter(chat => chat.RoomType === true);
          console.log(this.groupChat);  
  
          console.log("Grouplist", this.groupChat);
          // this.dataShareService.updateChatListData(chats);
          this.signalRService.AddToGroup(chats);
  
          this.dataShareService.updateChatListData(chats);
        });

        this.addNewGroupListener();
        this.UpdatePrivateChatList();
        this.updateGroupChatList();
        this.updateQuitGroup();
      }
    }

  getSelectedChatRoom(ChatRoom:ChatListVM)
  {
    this.dataShareService.updateSelectedChatRoom(ChatRoom);
    console.log("Selected this chat room from chat list: ", ChatRoom.ChatRoomId);
  }  
  

  private UpdatePrivateChatList(): void {
    this.signalRService.updatePrivateChatlist()
      .subscribe((chatlist: ChatListVM) => {
        console.log("list",chatlist)
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


  private updateGroupChatList():void {
    this.signalRService.removeUserListener()
        .subscribe(({ chatRoomId, userId }) => {
          console.log("removeuser", chatRoomId,userId)
          if(this.userId == userId)
          {
            this.groupChat = this.groupChat.filter(chat => chat.ChatRoomId != chatRoomId);
          }
        });
  }


  private updateQuitGroup():void {
    this.signalRService.quitGroupListener()
        .subscribe(({ chatRoomId, userId }) => {
          console.log("quited", chatRoomId,userId)
          if(this.userId == userId)
          {
            this.groupChat = this.groupChat.filter(chat => chat.ChatRoomId != chatRoomId);
          }
        });
  }




  private addNewGroupListener(): void
  {  
    this.signalRService.addNewGroupListener().subscribe(chatListVM => {
      console.log('Received new group :', chatListVM);
      // Add the new room to the groupChat array
      this.groupChat.push(chatListVM);
  
    });
  }

}