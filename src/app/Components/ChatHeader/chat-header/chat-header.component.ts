import { Component, OnInit } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { DeleteFriendRequest } from '../../../Models/DTO/DeleteFriend/delete-friend-request';
import { TypingStatus } from '../../../Models/DTO/TypingStatus/typing-status';
import { FriendsService } from '../../../Services/FriendService/friends.service';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent implements OnInit{

  constructor(
    private _dataShareService:DataShareService,
    private localStorage: LocalstorageService,
    private friendService: FriendsService,
    private _signalRService: SignalRService
    ){}
  
  private userId1: number = parseInt(this.localStorage.getItem('userId') || '');
  request: DeleteFriendRequest = { ChatRoomId: 0, UserId1: 0, UserId2: 0 };
  isVisible = false;
  currentChatRoom = {} as ChatListVM;
  IsCurrentChatUser: boolean = false;
  InComingUsers: string[] =[];

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
      this.IsCurrentChatUser = false;
    });

    this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
      //Check If Current Chat Room
      if (status.ChatRoomId === this.currentChatRoom.ChatRoomId) 
      {
        // For Group Chat
        if(this.currentChatRoom.RoomType)
        {
          this.IsCurrentChatUser = true;
          if (status.isTyping) {
            // Add the user if they are typing and not already present in the list
            if (!this.InComingUsers.includes(status.currentUserProfileName)) {
              this.InComingUsers.push(status.currentUserProfileName);
            }
          } 
          else{
            this.InComingUsers = this.InComingUsers.filter(name => name !== status.currentUserProfileName);
          }
        }
        // For One-On-One Chat
        else{
          this.IsCurrentChatUser = status.isTyping;
        }
      }
      // Different Chat Room
      else{
        this.IsCurrentChatUser = false;
      }
    });

  }

  DeleteFriend(): void {
    this.request = {
      ChatRoomId: this.currentChatRoom.ChatRoomId,
      UserId1: this.userId1,
      UserId2: this.currentChatRoom.UserId
    };
    
    this.friendService.DeleteFriend(this.request).subscribe(response => {
      console.log('Friend Deleted successful: ', response);
    });
  }

    //Model
    showModal(): void {
      this.isVisible = true;
    }
  
    handleOk(): void {
      this.DeleteFriend();
      console.log('Button ok clicked!');
      this.isVisible = false;
    }
  
    handleCancel(): void {
      console.log('Button cancel clicked!');
      this.isVisible = false;
    }

}
