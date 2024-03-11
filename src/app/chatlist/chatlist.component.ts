import { Component, inject, Inject, Input, OnInit, NgZone } from '@angular/core';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { Group } from '../Models/DTO/Group/group';
import { UserProfileUpdate } from '../Models/DTO/UserProfileUpdate/user-profile-update';
import { GroupProfileUpdate } from '../Models/DTO/GroupProfileUpdate/group-profile-update';
import { ChatRoomMessages } from '../Models/DTO/ChatRoomMessages/chatroommessages';

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
  newMessagesIndicator: boolean = false;

  constructor(
    private chatlistService: ChatlistService,
    private dataShareService: DataShareService,
    private signalRService: SignalRService,
    private localStorage: LocalstorageService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.getChatList();
    this.listenForNewMessages();
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
    ChatRoom.UnreadCount = 0; // Reset unread count
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
  
  private RetrieveChatlist() : void //
  {
    this.signalRService.retrieveChatlistListener()
    .subscribe((chats: ChatListVM[]) => {
      this.privateChat = chats.filter(chat => chat.RoomType === false);
      this.groupChat = chats.filter(chat => chat.RoomType === true); 
    });
  }

  private updateGroupChatList(): void {  //signalR at the sidebar
    this.signalRService.removeUserListener()
      .subscribe(({ chatRoomId, userId }) => {
        if (this.userId == userId) {
          this.groupChat = this.groupChat.filter(chat => chat.ChatRoomId != chatRoomId);
          this.dataShareService.clearSelectedChatRoom(this.isSelectedData);
          
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
      const myChats = chatListVM.filter(chat => chat.UserId == this.userId);
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

  private listenForNewMessages(): void {
    this.signalRService.updateMessageListener().subscribe((newMessage: ChatRoomMessages) => {
      //newMessage.ChatRoomId identifies group chats and newMessage.UserId identifies private chats
      const isGroupMessage = newMessage.ChatRoomId !== undefined;
      if (isGroupMessage) {
        const chatIndex = this.groupChat.findIndex(chat => chat.ChatRoomId === newMessage.ChatRoomId);
        if (chatIndex !== -1) {
          // Increment unread count for group chat
          this.groupChat[chatIndex].UnreadCount = (this.groupChat[chatIndex].UnreadCount || 0) + 1;
        }
      } else {
        // Handle private chat
        // Assuming newMessage.UserId is available and corresponds to the userId in the chat item
        const chatIndex = this.privateChat.findIndex(chat => chat.UserId === newMessage.UserId);
        if (chatIndex !== -1) {
          // Increment unread count for private chat
          this.privateChat[chatIndex].UnreadCount = (this.privateChat[chatIndex].UnreadCount || 0) + 1;
        }
      }

      this.updateDropdownHeader();
    });
  }
  
  private updateDropdownHeader(): void {
    // Check if there are any unread messages in either private or group chats
    const hasUnreadMessages = this.privateChat.some(chat => chat.UnreadCount > 0) || this.groupChat.some(chat => chat.UnreadCount > 0);
    this.newMessagesIndicator = hasUnreadMessages;
  }

}