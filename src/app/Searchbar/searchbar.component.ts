import { Component, OnInit, NgZone } from '@angular/core';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FriendsService } from '../Services/FriendService/friends.service';
import { UserService } from '../Services/UserService/user.service';
import { SignalRFriendService } from '../Services/SignalR/Friend/signal-rfriend.service';
import { UserSearchDetails } from '../Models/DTO/User/user-search-details';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit {

  constructor(private friendService: FriendsService, private search: UserService, private signalR: SignalRFriendService,
    private ngZone: NgZone, private localStorage: LocalstorageService) { }

  //variable declare
  isCollapsed = false;
  public searchValue: string = '';
  public searchResult: UserSearchDetails[] = []; // array
  private isVisible = false;
  private searchSubject: Subject<string> = new Subject<string>()
  // get username form local storage
  private userId: number = parseInt(this.localStorage.getItem('userId') || '');

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
        this.ngZone.run(() => {
          this.signalR.notifyFriendRequest(receiverId, this.userId, this.searchValue);
        });
      });
  }

  //signalR: update data after click add button to add friend
  private UpdateSearchToPending(): void {
    this.signalR.updateSearchResultsListener()
      .subscribe((UserId: number) => {
        const newresult = this.searchResult.find(user => user.UserId == UserId)
        if (newresult) {
          newresult.Status = 1;
          console.log("new", this.searchResult);
        }
        console.log('Received updated search results to pending:', this.searchResult);
      });
  }

  //signal: update data after accept friend request
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

  //Model
  showModal(): void {
    this.isVisible = true;
  }
}
