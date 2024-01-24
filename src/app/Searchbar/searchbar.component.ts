import { Component, OnInit } from '@angular/core';
import { Console } from 'console';
import { response } from 'express';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap} from 'rxjs/operators';
import { FriendsService } from '../Services/FriendService/friends.service';
import { UserService } from '../Services/UserService/user.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit{
  isCollapsed = false;
  searchValue: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  searchResult: any[] = []; // array
  
  constructor(private userService: UserService, private friendService: FriendsService){}

  ngOnInit(): void{
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(searchValue => searchValue !== '' ? this.userService.getSearch(searchValue, 7) : of([]))
    ).subscribe(response =>{
      this.searchResult = response;
      console.log('Backend Search Result:', response);
    });
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchValue);
  }

  OnSendFriendRequest(receiverId: number, sId: string ):void{
    var senderId = + sId;
    this.friendService.addFriends({RequestId:null, SenderId: senderId, ReceiverId: receiverId, Status: 0})
      .subscribe(response => console.log('Friend Created successful: ', response));

    console.log(`Sending friend request to user with ID: ${receiverId} and senderId :${senderId}`);
  }

}
