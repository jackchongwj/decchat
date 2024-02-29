import { Component, inject, Inject, Input, OnInit, NgZone } from '@angular/core';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { Group } from '../Models/DTO/Group/group';
import { UserProfileUpdate } from '../Models/DTO/UserProfileUpdate/user-profile-update';
import { GroupProfileUpdate } from '../Models/DTO/GroupProfileUpdate/group-profile-update';


@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})

export class ChatlistComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  showChatList = false;
  privateChat: ChatListVM[] = [];
  groupChat: ChatListVM[] = [];
  userId: number = parseInt(this.localStorage.getItem('userId') || '');
  isSelectedData: boolean = false;

  constructor(
    private chatlistService: ChatlistService,
    private dataShareService: DataShareService,
    private signalRService: SignalRService,
    private localStorage: LocalstorageService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.getChatList();
  }

  getChatList() {
    // Create a Group instance with the userId
    if (this.privateChat.length === 0 && this.groupChat.length === 0)
    {
      this.RetrieveChatlist();
      this.UpdatePrivateChatList();
      this.updateGroupChatList();
      this.UpdateDeletePrivateChatlist();
      this.updateQuitGroup();
      this.ProfileDetailChanges();
      this.GroupDetailChanges();
      this.addNewGroupListener();
      this.UserOnlineChange();
    }
  }

  getSelectedChatRoom(ChatRoom: ChatListVM) {
    this.dataShareService.updateSelectedChatRoom(ChatRoom);
  }  

  private UpdatePrivateChatList(): void {
    this.signalRService.updatePrivateChatlist()
      .subscribe((chatlist: ChatListVM) => {
        this.privateChat.push(chatlist);
      });
  }

  private UpdateDeletePrivateChatlist(): void {
    this.signalRService.DelteFriend()
      .subscribe((userId: number) => {
        this.privateChat = this.privateChat.filter(chat => chat.UserId != userId);
        this.dataShareService.clearSelectedChatRoom(this.isSelectedData);
      });
  }
  
  private RetrieveChatlist() : void
  {
    this.signalRService.retrieveChatlistListener()
    .subscribe((chats: ChatListVM[]) => {
      this.privateChat = chats.filter(chat => chat.RoomType === false);
      this.groupChat = chats.filter(chat => chat.RoomType === true); 
    });
  }

  private updateGroupChatList(): void {
    this.signalRService.removeUserListener()
      .subscribe(({ chatRoomId, userId }) => {
        if (this.userId == userId) {
          this.groupChat = this.groupChat.filter(chat => chat.ChatRoomId != chatRoomId);
          // this.dataShareService.clearSelectedChatRoom(this.isSelectedData);
        }
      });
  }

  private updateQuitGroup(): void {
    this.signalRService.quitGroupListener()
      .subscribe(({ chatRoomId, userId }) => {
        if (this.userId == userId) {
          this.groupChat = this.groupChat.filter(chat => chat.ChatRoomId != chatRoomId);
          this.dataShareService.clearSelectedChatRoom(this.isSelectedData);
        }
      });
  }

  private addNewGroupListener(): void {
    this.signalRService.addNewGroupListener().subscribe((chatListVM: ChatListVM[]) => {
      const myChats = chatListVM.filter(chat => chat.UserId === this.userId);
      // Add the new room to the groupChat array
      this.groupChat.push(...myChats);
    });
  }

  private ProfileDetailChanges(): void {
    this.signalRService.profileUpdateListener().subscribe({
      next: (updateInfo: UserProfileUpdate) => {
        this.privateChat.forEach((chat) => {
          if(chat.UserId === updateInfo.UserId) {
            if(updateInfo.ProfileName) {
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
        var result = this.groupChat.findIndex(chatlist => chatlist.ChatRoomId == updateInfo.ChatRoomId)

        if (updateInfo.GroupName !== undefined) {
          this.groupChat[result].ChatRoomName = updateInfo.GroupName;
        }
        if (updateInfo.GroupPicture !== undefined) {
          this.groupChat[result].ProfilePicture = updateInfo.GroupPicture;
        }
      },
      error: (error) => console.error('Error listening for profile updates:', error),
    });
  }

  private UserOnlineChange(): void {
    this.signalRService.userOnlineStatusListener().subscribe(({userId, isOnline}) =>{
      this.privateChat.forEach((chat) => {
        if(chat.UserId.toString() == userId) {
          chat.IsOnline = isOnline;
        }
      });
    })
  }

}