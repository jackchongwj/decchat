import { Component, OnInit } from '@angular/core';
import { FriendRequest } from '../../Models/DTO/Friend/friend-request';
import { User } from '../../Models/User/user';
import { FriendsService } from '../../Services/FriendService/friends.service';
import { LocalstorageService } from '../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRFriendService } from '../../Services/SignalR/Friend/signal-rfriend.service';
import { UserService } from '../../Services/UserService/user.service';


@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrl: './addfriend.component.css'
})
export class AddfriendComponent implements OnInit {
  constructor(private usersService: UserService, private friendService: FriendsService, private signalRService: SignalRFriendService,
    private dataShareService: DataShareService, private localStorage: LocalstorageService) { }

  getFriendRequest: User[] = [];
  isVisible = false;
  private userId: number = parseInt(this.localStorage.getItem('userId') || '');
  request: FriendRequest = { ReceivedId: 0, SenderId: 0, Status: 0 };

  ngOnInit(): void {
    this.usersService.getFriendRequest(this.userId)
      .subscribe(response => {
        this.getFriendRequest = response;
        console.log("Friend Request Result: ", response);
      });

    this.updateFriendRequestListener();

  }

  acceptFriendRequest(senderId: number): void {
    this.request = {
      ReceivedId: this.userId,
      SenderId: senderId,
      Status: 2
    };

    this.UpdateFriendRequest(this.request);
  }

  rejectFriendRequest(senderId: number): void {
    this.request = {
      ReceivedId: this.userId,
      SenderId: senderId,
      Status: 3
    };

    this.UpdateFriendRequest(this.request);
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

  //service
  private UpdateFriendRequest(FRequest: FriendRequest): void {
    console.log(FRequest);
    this.friendService.UpdateFriendRequest(FRequest)
      .subscribe(response => {
        console.log("Update Friend Request: ", response);
        this.refreshRequest();
        FRequest.Status == 2 ? this.signalRService.acceptFriendRequest(response, FRequest.SenderId, this.userId) :
          this.signalRService.rejectFriendRequest(FRequest.SenderId, this.userId);
      });
  }

  //signalR
  private updateFriendRequestListener(): void {
    this.signalRService.updateFriendRequestListener()
      .subscribe((newResults: User[]) => {
        console.log("new result", newResults);
        this.getFriendRequest = newResults;
        console.log('Received updated friend request results:', this.getFriendRequest);
      });
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
