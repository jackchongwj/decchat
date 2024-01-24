import { Component, OnInit } from '@angular/core';
import { FriendRequest } from '../../Models/DTO/Friend/friend-request';
import { FriendsService } from '../../Services/FriendService/friends.service';
import { UserService } from '../../Services/UserService/user.service';

@Component({
  selector: 'app-add-friend-dialog-content',
  templateUrl: './add-friend-dialog-content.component.html',
  styleUrl: './add-friend-dialog-content.component.css'
})
export class AddFriendDialogContentComponent implements OnInit {
  constructor(private usersService: UserService, private friendService: FriendsService){}
  getFriendRequest: any[] = [];
  request: FriendRequest = {ReceivedId: 0, SenderId: 0,Status: 0 };

  ngOnInit(): void {
    this.usersService.getFriendRequest(7)
    .subscribe(response => {
      this.getFriendRequest = response;
      console.log("Friend Request Result: ", response);
    });
  }

  acceptFriendRequest(senderId:number, rId:string) : void{
    var receivedId = + rId;
    this.request = {
      ReceivedId: receivedId,
      SenderId: senderId,
      Status: 2
    };
    
    console.log(this.request);
    this.friendService.UpdateFriendRequest(this.request)
    .subscribe(response => {
      console.log("Accept Friend: ", response);
    });
  }
  
  rejectFriendRequest(senderId:number, rId:string): void{
    var receivedId = + rId;
    this.request = {
      ReceivedId: receivedId,
      SenderId: senderId,
      Status: 3
    };
    
    console.log(this.request);
    this.friendService.UpdateFriendRequest(this.request)
    .subscribe(response => {
      console.log("Reject Friend: ", response);
    });
  }
}
