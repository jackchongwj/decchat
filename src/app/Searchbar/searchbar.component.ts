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
  isVisible = false;
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
   if(this.signalR.updateSearchResultsAfterAccept())
   {
    this.signalR.updateSearchResultsAfterAccept()
    .subscribe((UserId: number) => {
      const newresult =  this.searchResult.find(user => user.UserId == UserId)
      if(newresult)
      {
        newresult.Status = 2;
        console.log("new", this.searchResult);
      }
      console.log('Received updated search results After Accept Friend:', this.searchResult);
    });
   }
    this.signalR.updateSearchResultsListener()
      .subscribe((UserId: number) => {
        const newresult =  this.searchResult.find(user => user.UserId == UserId)
        if(newresult)
        {
          newresult.Status = 1;
          console.log("new", this.searchResult);
        }
        console.log('Received updated search results:', this.searchResult);
      });
      
  }

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

  
  //Model
  showModal(): void {
    this.isVisible = true;
  }
}
