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
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  IsCurrentChatUser: boolean = false;

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
      this.IsCurrentChatUser = false;
    });

    this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
      if(status.isTyping && status.ChatRoomId == this.currentChatRoom.ChatRoomId)
      {
        this.IsCurrentChatUser = true;
      }
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
    console.log("delete friend")
    this.friendService.DeleteFriend(this.request).subscribe(response => {
      console.log('Friend Deleted successful: ', response);
      this._dataShareService.clearSelectedChatRoom();
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
