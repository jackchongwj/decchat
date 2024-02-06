import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Console } from 'console';
import { response } from 'express';
import { takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap} from 'rxjs/operators';
import { FriendsService } from '../Services/FriendService/friends.service';
import { UserService } from '../Services/UserService/user.service';
import { SignalRFriendService } from '../Services/SignalR/Friend/signal-rfriend.service';
import { UserDetails } from '../Models/DTO/User/user-details';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit{
  isCollapsed = false;
  searchValue: string = '';
  searchResult: any[] = []; // array
  // userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  private searchSubject: Subject<string> = new Subject<string>()
  private destroy$ = new Subject<void>();

  
  constructor(private friendService: FriendsService, private search: UserService, private signalR: SignalRFriendService,
    private ngZone: NgZone, private localStorage: LocalstorageService){}
    
   private userId: number = parseInt(this.localStorage.getItem('userId') || '');


  ngOnInit(): void{
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(searchValue => searchValue !== '' ? this.search.getSearch(searchValue, this.userId) : of([]))
    ).subscribe(response =>{
      this.searchResult = response;
      console.log('Backend Search Result:', response);
    });
   
    // this.signalR.addFriendRequestListener()
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(() => {
    //         console.log('Received friend request notification');
    //         this.refreshSearchResults();
    //     });

    this.signalR.updateSearchResultsListener()
      .subscribe((UserId: number) => {
        const newresult =  this.searchResult.find(user => user.userId == UserId)
        if(newresult)
        {
          newresult.status = 1;
          console.log("new", this.searchResult);
        }
        console.log('Received updated search results:', this.searchResult);
      });
  }

  //if end the component then the signalR will stop
  // ngOnDestroy(): void {
  //   this.signalR.stopConnection();
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchValue);
  }

  OnSendFriendRequest(receiverId: number): void {
    this.friendService.addFriends({ RequestId: null, SenderId: this.userId, ReceiverId: receiverId, Status: 0 })
      .subscribe(response => {
        console.log('Friend Created successful: ', response);
        this.ngZone.run(() => {
          this.signalR.notifyFriendRequest(receiverId, this.userId, this.searchValue);
        });
      });
  }

  // OnSendFriendRequest(receiverId: number, sId: string ):void{
  //   var senderId = + sId;
  //   this.friendService.addFriends({RequestId:null, SenderId: senderId, ReceiverId: receiverId, Status: 0})
  //     .subscribe(response =>{ console.log('Friend Created successful: ', response)
  //     // this.refreshSearchResults();
  //   });
      
  //     this.signalR.notifyFriendRequest(receiverId, senderId, this.searchValue);
  // }

  // private refreshSearchResults(): void {
  //   this.search.getSearch(this.searchValue, 7).subscribe(
  //     (results) => {
  //       this.searchResult = results;
  //       console.log('Search results refreshed:', results);
  //     },
  //     (error) => {
  //       console.error('Error refreshing search results:', error);
  //     }
  //   );
  // }
}
