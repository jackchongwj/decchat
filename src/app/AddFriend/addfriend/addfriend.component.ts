import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { FriendRequest } from '../../Models/DTO/Friend/friend-request';
import { User } from '../../Models/User/user';
import { FriendsService } from '../../Services/FriendService/friends.service';
import { LocalstorageService } from '../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';
import { UserService } from '../../Services/UserService/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrl: './addfriend.component.css'
})
export class AddfriendComponent implements OnInit {
  constructor(
    private usersService: UserService,
    private friendService: FriendsService,
    private signalRService: SignalRService,
    private localStorage: LocalstorageService,
    private message: NzMessageService,
    private zone:NgZone) 
  { }

  isVisible = false;
  private userId: number = this.localStorage.getUserId();

  requestStates = new Map<string, boolean>();
  getFriendRequest: User[] = [];
  request: FriendRequest = { ReceiverId: 0, SenderId: 0, Status: 0 };

  chatlist = {} as ChatListVM
  @Input() isCollapsed: boolean = false;

  ngOnInit(): void {

    this.GetFriendRequest();
    this.updateFriendRequestListener();

  }

  acceptFriendRequest(senderId: number): void {

    if(!this.requestStates.get(senderId.toString()))
    {
      this.zone.run(() => {
        this.requestStates.set(senderId.toString(), true);
      });

      this.request = {
        ReceiverId: 0,
        SenderId: senderId,
        Status: 2
      };

      this.UpdateFriendRequest(this.request);
      this.message.success('Accepted');
    }
  }

  rejectFriendRequest(senderId: number): void {
    
    this.request = {
      ReceiverId: 0,
      SenderId: senderId,
      Status: 3
    };

    this.UpdateFriendRequest(this.request);
    this.message.success('Rejected');
  }

  //service
  private UpdateFriendRequest(FRequest: FriendRequest): void {

    this.friendService.UpdateFriendRequest(FRequest)
      .subscribe(response => {
        this.getFriendRequest = this.getFriendRequest.filter(User => User.UserId != FRequest.SenderId)
      });
  }

  private GetFriendRequest()
  {
    this.usersService.getFriendRequest()
      .subscribe(response => {
        this.getFriendRequest = response;
      });
  }

  //signalR
  private updateFriendRequestListener(): void {
    this.signalRService.updateFriendRequestListener()
      .subscribe((newResults: User[]) => {
        this.getFriendRequest = newResults;
      });
  }

  //Model
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.requestStates.clear();
  }
}
