import { AfterViewInit, Component, inject, Inject, Input, OnInit, NgZone } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../../app/Services/Chatlist/chatlist.service';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { SignalRFriendService } from '../Services/SignalR/Friend/signal-rfriend.service';
import { UserProfileUpdate } from '../Models/DTO/UserProfileUpdate';
import { GroupProfileUpdate } from '../Models/DTO/GroupProfileUpdate';

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
    // this.getChatList();
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

        console.log("privateGrouplist", chats);
        // this.dataShareService.updateChatListData(chats);
        this.signalRService.AddToGroup(chats);

        this.dataShareService.updateChatListData(chats);
      });

      this.UpdatePrivateChatList();
      this.ProfileDetailChanges();
      this.GroupDetailChanges();
    }
  }

  getSelectedChatRoom(ChatRoom:ChatListVM)
  {
    this.dataShareService.updateSelectedChatRoom(ChatRoom);
    console.log("Selected from chat list: ", ChatRoom);
  }  

  private UpdatePrivateChatList(): void {
    this.signalRFService.updatePrivateChatlist()
      .subscribe((chatlist: ChatListVM) => {
        console.log("list",chatlist)
        this.privateChat = this.privateChat.concat(chatlist);
        console.log('Received updated private ChatList:', this.privateChat);
      });
  }

  private ProfileDetailChanges(): void {
    this.signalRService.profileUpdateListener().subscribe({
      next: (updateInfo: UserProfileUpdate) => {
        console.log('Updating chatlist')
        this.privateChat.forEach((chat) => {
          console.log(updateInfo.ProfileName)
          if(chat.UserId === updateInfo.UserId) {
            if(updateInfo.ProfileName) {
              console.log('update userId '+ chat.UserId)
              chat.ChatRoomName = updateInfo.ProfileName;
              
            }
            if(updateInfo.ProfilePicture) {
              chat.ProfilePicture = updateInfo.ProfilePicture;
            }
          }
        });
      },
      error: (error) => console.error('Error listening for profile updates:', error),
    });
  }

  private GroupDetailChanges(): void {
    this.signalRService.groupUpdateListener().subscribe({
      next: (updateInfo: GroupProfileUpdate) => {
        console.log('Updating chatlist')
        this.privateChat.forEach((chat) => {
          if(chat.ChatRoomId === updateInfo.ChatRoomId) {
            if(updateInfo.GroupName) {
              console.log('update userId '+ chat.UserId)
              chat.ChatRoomName = updateInfo.GroupName;
              
            }
            if(updateInfo.GroupPicture) {
              chat.ProfilePicture = updateInfo.GroupPicture;
            }
          }
        });
      },
      error: (error) => console.error('Error listening for profile updates:', error),
    });
  }
}