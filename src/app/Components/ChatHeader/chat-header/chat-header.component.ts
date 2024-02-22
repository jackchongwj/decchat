import { Component, OnInit } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { TypingStatus } from '../../../Models/DTO/TypingStatus/typing-status';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';
import { Group } from '../../../Models/DTO/Group/group';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
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
  // selectedUsers: number[] = [];
  groupMembers: GroupMemberList[] = [];
  groupChat: ChatListVM[] = [];


  constructor(
    private _dataShareService:DataShareService,
    private _signalRService:SignalRService, 
    private modalService: NzModalService, 
    private localStorage: LocalstorageService,
    private groupMemberServiceService: GroupMemberServiceService
    ){}
    
  currentChatRoom = {} as ChatListVM;
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  IsCurrentChatUser: boolean = false;

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
      this.IsCurrentChatUser = false;
      console.log("ccroom",this.currentChatRoom);
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

    // this._dataShareService.selectedUsers.subscribe(userId => {
    //     this.selectedUsers = userId;
    //   });
  }
  
  // handleOk(): void {
  

  // // Create a Group instance with the data
  // const newGroup = new Group(this.roomName, this.selectedUsers, this.InitiatedBy, 0); // Assuming UserId is not relevant here

  // // Send data to the backend
  // this.chatlistService.createNewGroup(newGroup).subscribe({
  //   next: (response) => {
  //     // Handle the response from the backend if needed
  //     console.log('Backend response:', response);
  //   },
  //   error: (error) => {
  //     console.log('Error from the backend:', error);
  //   }
  // });

  //   // console.log('Button ok clicked!');
  //   this.isVisible = false;
  // }

  showModal():void{
    this.isVisible = true;

    console.log("clicked");
    // this.getGroupMembers();

    this.groupMemberServiceService.getGroupMembers(this.currentChatRoom.ChatRoomId, this.userId).pipe(
      ).subscribe(groupMembers => {
        console.log(groupMembers);
        this.groupMembers = groupMembers;
        console.log(this.groupMembers);
      });
    
    // this._signalRService.removeUserListener()
    // .subscribe(user: => {
    //   console.log('Received new group :', this.groupMembers);
    //   // Add the new room to the groupChat array
    //   this.groupChat.push(this.groupMembers);
    // });

      // this._signalRService.removeUserListener()
      //   .subscribe(({ChatRoomId, UserId}) => {
      //     console.log("ChatRoomId:", ChatRoomId);
      //     console.log("UserId:", UserId);
      //     // console.log('Received updated friend request result/s:', this.getFriendRequest);
      //   });

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


  // Delete(userId: number):void{
    
  //   console.log(userId);
  //   this.deleteMember = 
  //   {
  //     ChatRoomId: this.currentChatRoom.ChatRoomId,
  //     UserId: userId,
  //     ProfileName: "",
  //     ProfilePicture: "",
  //     SelectedUsers: []
  //   }


    // this.chatlistService.createNewGroup(newGroup).subscribe({
    //   next: (response) => {
    //     // Handle the response from the backend if needed
    //     console.log('Backend response:', response);
    //   },
    //   error: (error) => {
    //     console.log('Error from the backend:', error);
    //   }
    // });


  //   this.groupMemberServiceService.removeUser(this.deleteMember).subscribe({
  //     next: (response) => {
  //       // Handle the response from the backend if needed
  //       console.log('Backend response:', response);
  //     },
  //     error: (error) => {
  //       console.log('Error from the backend:', error);
  //     }
  //   });
  // }

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
  



  
  // getGroupMembers(): void {
  //   const chatRoomId = 214; // Replace with actual chat room ID
   
  // }






  // fetchSelectedUsers(): void {
  //   // Make an HTTP request to fetch selectedUsers from the backend
  //   this.http.get<number[]>('your-backend-url/selectedUsersEndpoint').subscribe(
  //     (data: number[]) => {
  //       this.selectedUsers = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching selectedUsers:', error);
  //     }
  //   );
  // }

  
  // addOrKickMember(): void {
  //   // const modalRef: NzModalRef = this.modalService.create({
  //   //   nzTitle: 'Add/Kick Member',
  //   //   nzFooter: null // If you don't want a footer, you can set it to null
  //   // });

  //   // // Set properties on the component instance after creating it
  //   // modalRef.componentInstance.selectedUsers = this.selectedUsers;
  //   // console.log('Selected Users:', this.selectedUsers);
  // }




  
} 
