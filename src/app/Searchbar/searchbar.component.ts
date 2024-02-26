import { Component, OnInit, NgZone, Input } from '@angular/core';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FriendsService } from '../Services/FriendService/friends.service';
import { UserService } from '../Services/UserService/user.service';
import { UserSearchDetails } from '../Models/DTO/User/user-search-details';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';

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
    private signalR: SignalRService) { }

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
      switchMap(searchValue => searchValue !== '' ? this.search.getSearch(searchValue, this.userId) : of([]))
    ).subscribe(response => {
      this.searchResult = response;
      console.log('Backend Search Result:', response);
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
        console.log('Friend Created successful: ', response);
      });
  }

  //signalR: update data after click add button to add friend
  private UpdateSearchToPending(): void {
    this.signalR.updateSearchResultsListener()
      .subscribe((UserId: number) => {
        console.log("pending", this.userId);
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 1;
          console.log("new", this.searchResult);
        }
        console.log('Received updated search results to pending:', this.searchResult);
      });
  }

  //signal: update data after reject friend request
  private UpdateSearchAfterAceptFriend(): void {
    this.signalR.updateSearchResultsAfterReject()
      .subscribe((UserId: number) => {
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 3;
          console.log("new", this.searchResult);
        }
        console.log('Received updated search results to friend:', this.searchResult);
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
        console.log('Received updated search results to friend:', this.searchResult);
      });
  }

  
  private UpdateDeletePrivateChatlist(): void {
    this.signalR.DelteFriend()
      .subscribe((UserId: number) => {
        console.log("Delete {UserId}",UserId)
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 3;
          console.log("new", this.searchResult);
        }
        console.log('Received updated private ChatList:', this.searchResult);
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
