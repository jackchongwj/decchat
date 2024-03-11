import { Component, OnInit, NgZone, Input } from '@angular/core';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FriendsService } from '../Services/FriendService/friends.service';
import { UserService } from '../Services/UserService/user.service';
import { UserSearchDetails } from '../Models/DTO/User/user-search-details';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit {

  constructor(
    private friendService: FriendsService, 
    private search: UserService, 
    private ngZone: NgZone, 
    private localStorage: LocalstorageService,
    private signalR: SignalRService,
    private message: NzMessageService) { }

  //variable declare
  isCollapsed = false;

  //search
  public searchValue: string = '';
  public searchResult: UserSearchDetails[] = []; 
  private searchSubject: Subject<string> = new Subject<string>()
  @Input() iSCollapsed: boolean = false;
  // get username form local storage
  private userId: number = parseInt(this.localStorage.getItem('userId') || '');
  isVisible = false;
  

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(searchValue => searchValue !== '' ? this.search.getSearch(searchValue) : of([]))
    ).subscribe(response => {
      this.searchResult = response;
    });

    this.UpdateSearchToPending();

    this.UpdateSearchAfterAceptFriend();

    this.UpdateSearchAfterReject();

    this.UpdateDeletePrivateChatlist();
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchValue);
  }

  //signalR
  //signalR: send friend request
  OnSendFriendRequest(receiverId: number): void {
    this.friendService.addFriends({ RequestId: null, SenderId: this.userId, ReceiverId: receiverId, Status: 0 })
      .subscribe(response => {
        this.message.success('Friend Request send successfully');
      },
      (error) => {
        this.message.error('Friend Has Added Before');
      });
  }

  

  //signalR: update data after click add button to add friend
  private UpdateSearchToPending(): void {
    this.signalR.updateSearchResultsListener()
      .subscribe((UserId: number) => {
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 1;
        }
      });
  }

  //signal: update data after reject friend request
  private UpdateSearchAfterAceptFriend(): void {
    this.signalR.updateSearchResultsAfterReject()
      .subscribe((UserId: number) => {
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 3;
        }
      });
  }

  //signal: update data after accept friend request
  private UpdateSearchAfterReject(): void {
    this.signalR.updateSearchResultsAfterAccept()
      .subscribe((UserId: number) => {
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 2;
        }
      });
  }

  
  private UpdateDeletePrivateChatlist(): void {
    this.signalR.DelteFriend()
      .subscribe((UserId: number) => {
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 3;
        }
      });
  }

  //Model
  ShowSearchModal(): void
  {
    this.isVisible = true;
  }

  CloseModel(): void
  {
    this.searchValue = "";
    this.isVisible = false;
  }


}
