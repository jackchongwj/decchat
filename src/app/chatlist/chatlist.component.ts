import { AfterViewInit, Component, inject, Inject, Input, OnInit, NgZone } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../../app/Services/Chatlist/chatlist.service';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { Group } from '../Models/DTO/Group/group';
import { UserProfileUpdate } from '../Models/DTO/UserProfileUpdate';
import { GroupProfileUpdate } from '../Models/DTO/GroupProfileUpdate';


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
    }
  }

  getSelectedChatRoom(ChatRoom: ChatListVM) {
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
        console.log("Delete {userId}", userId);
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

  private updateGroupChatList(): void {
    this.signalRService.removeUserListener()
      .subscribe(({ chatRoomId, userId }) => {
        console.log("removeuser", chatRoomId, userId)
        if (this.userId == userId) {
          this.groupChat = this.groupChat.filter(chat => chat.ChatRoomId != chatRoomId);
        }
        this.dataShareService.clearSelectedChatRoom(this.isSelectedData);
      });
  }

  private updateQuitGroup(): void {
    this.signalRService.quitGroupListener()
      .subscribe(({ chatRoomId, userId }) => {
        console.log("quited", chatRoomId, userId)
        if (this.userId == userId) {
          this.groupChat = this.groupChat.filter(chat => chat.ChatRoomId != chatRoomId);
        }
        this.dataShareService.clearSelectedChatRoom(this.isSelectedData);
      });
  }

  private addNewGroupListener(): void {
    this.signalRService.addNewGroupListener().subscribe(chatListVM => {
      console.log('Received new group :', chatListVM);
      // Add the new room to the groupChat array
      this.groupChat.push(chatListVM);

    });
  }
  private ProfileDetailChanges(): void {
    this.signalRService.profileUpdateListener().subscribe({
      next: (updateInfo: UserProfileUpdate) => {
        console.log('Updating private chatlist')
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
        console.log('Updating group chatlist', this.groupChat)
        var result = this.groupChat.findIndex(chatlist => chatlist.ChatRoomId == updateInfo.ChatRoomId)

        if (updateInfo.GroupName !== undefined) {
          this.groupChat[result].ChatRoomName = updateInfo.GroupName;
        }
        if (updateInfo.GroupPicture !== undefined) {
          this.groupChat[result].ProfilePicture = updateInfo.GroupPicture;
        }
        // this.groupChat.forEach((chat) => {
        //   if(chat.ChatRoomId === updateInfo.ChatRoomId) {
        //     if(updateInfo.GroupName) {
        //       console.log('update userId '+ chat.UserId)
        //       chat.ChatRoomName = updateInfo.GroupName;
              
        //     }
        //     if(updateInfo.GroupPicture) {
        //       chat.ProfilePicture = updateInfo.GroupPicture;
        //     }
        //   }
        // });
      },
      error: (error) => console.error('Error listening for profile updates:', error),
    });
  }
}