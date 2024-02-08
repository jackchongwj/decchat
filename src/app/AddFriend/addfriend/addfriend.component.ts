import { Component, OnInit } from '@angular/core';
import { FriendRequest } from '../../Models/DTO/Friend/friend-request';
import { User } from '../../Models/User/user';
import { FriendsService } from '../../Services/FriendService/friends.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRFriendService } from '../../Services/SignalR/Friend/signal-rfriend.service';
import { UserService } from '../../Services/UserService/user.service';


@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrl: './addfriend.component.css'
})
export class AddfriendComponent implements OnInit{
  constructor(private usersService:UserService, private friendService: FriendsService, private signalRService: SignalRFriendService,
    private dataShareService: DataShareService){}

  getFriendRequest: any[] = [];
  isVisible = false;
  userId: number = 25;
  //userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  request: FriendRequest = {ReceivedId: 0, SenderId: 0,Status: 0 };

  ngOnInit(): void {
    this.usersService.getFriendRequest(this.userId)
    .subscribe(response => {
      this.getFriendRequest = response;
      console.log("Friend Request Result: ", response);
    });

    this.signalRService.updateFriendRequestListener()
    .subscribe((newResults: User[]) => {
      console.log("new result", newResults);
      this.getFriendRequest = newResults;
      console.log('Received updated friend request results:', this.getFriendRequest);
    });
  }

  acceptFriendRequest(senderId: number) : void{
    this.request = {
      ReceivedId: this.userId,
      SenderId: senderId,
      Status: 2
    };
    
    console.log(this.request);
    this.friendService.UpdateFriendRequest(this.request)
    .subscribe(response => {
      console.log("Accept Friend: ", response);
       this.refreshRequest();
      this.signalRService.acceptFriendRequest(response, senderId, this.userId);
    });
  }
  
  rejectFriendRequest(senderId:number): void{
    this.request = {
      ReceivedId: this.userId,
      SenderId: senderId,
      Status: 3
    };
    
    console.log(this.request);
    this.friendService.UpdateFriendRequest(this.request)
    .subscribe(response => {
      console.log("Reject Friend: ", response);
       this.refreshRequest();
    });
  }

   private refreshRequest(): void {
    this.usersService.getFriendRequest(7).subscribe(
      (results) => {
        this.getFriendRequest = results;
        console.log('Request results refreshed:', results);
      },
      (error) => {
        console.error('Error refreshing search results:', error);
      }
    );
  }



  //Model
  showModal(): void {
    this.isVisible = true;
  }

  // handleOk(): void {
  //   console.log('Button ok clicked!');
  //   this.isVisible = false;
  // }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
