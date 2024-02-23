import { Component, OnInit } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { DeleteFriendRequest } from '../../../Models/DTO/DeleteFriend/delete-friend-request';
import { TypingStatus } from '../../../Models/DTO/TypingStatus/typing-status';
import { FriendsService } from '../../../Services/FriendService/friends.service';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';
import { Group } from '../../../Models/DTO/Group/group';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { GroupMemberList } from '../../../Models/DTO/GroupMember/group-member-list';
import { GroupMemberServiceService } from '../../../Services/GroupMember/group-member-service.service';


@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent implements OnInit{
  isVisible: boolean = false; // Define the isVisible property here
  userId: number = parseInt(this.localStorage.getItem('userId') || '');
  groupMembers: GroupMemberList[] = [];
  groupChat: ChatListVM[] = [];


  constructor(
    private _dataShareService:DataShareService,
    private friendService: FriendsService,
    private _signalRService: SignalRService, 
    private modalService: NzModalService, 
    private localStorage: LocalstorageService,
    private groupMemberServiceService: GroupMemberServiceService
    ){}
  
  private userId1: number = parseInt(this.localStorage.getItem('userId') || '');
  request: DeleteFriendRequest = { ChatRoomId: 0, UserId1: 0, UserId2: 0 };
  currentChatRoom = {} as ChatListVM;
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  IsCurrentChatUser: boolean = false;

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
      this.IsCurrentChatUser = false;
      // console.log("ccroom",this.currentChatRoom);
      // this.fetchSelectedUsers();
      // this.getGroupMembers();

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

    showModaleRemove():void{
      this.isVisible = true;
  
      console.log("clicked");
      // this.getGroupMembers();
  
      this.groupMemberServiceService.getGroupMembers(this.currentChatRoom.ChatRoomId, this.userId).pipe(
        ).subscribe(groupMembers => {
          console.log(groupMembers);
          this.groupMembers = groupMembers;
          console.log(this.groupMembers);
        });
          
        this._signalRService.removeUserListener()
        .subscribe(({ chatRoomId, userId }) => {
          console.log("userid", userId);
          this.groupMembers = this.groupMembers.filter(list => list.UserId != userId);
          console.log("list", this.groupMembers);
          // console.log('Received updated friend request result/s:', this.getFriendRequest);
        });

        this._signalRService.quitGroupListener()
        .subscribe(({ chatRoomId, userId }) => {
          console.log("quited", chatRoomId,userId)
            this.groupMembers = this.groupMembers.filter(chat => chat.UserId != userId);
        });
      }

      Delete(userId: number): void {
        console.log(userId);
      
        this.groupMemberServiceService.removeUser(this.currentChatRoom.ChatRoomId, userId, this.userId).subscribe({
          next: (response) => {
            // Handle the response from the backend if needed
            console.log('Backend response:', response);
          },
          error: (error) => {
            console.log('Error from the backend:', error);
          }
        });
      }
    
      
      ExitGroup():void{  
        this.groupMemberServiceService.quitGroup(this.currentChatRoom.ChatRoomId, this.userId).subscribe({
          next: (response) => {
            // Handle the response from the backend if needed
            console.log('Backend response:', response);
          },
          error: (error) => {
            console.log('Error from the backend:', error);
          }
        });
      }
    
        handleOk(): void {
          console.log('Button ok clicked!');
          this.isVisible = false;
        }
      
        handleCancel(): void {
          console.log('Button cancel clicked!');
          this.isVisible = false;
        }
  
        

          
}