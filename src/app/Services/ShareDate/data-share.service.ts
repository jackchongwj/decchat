import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { User } from '../../Models/User/user';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  private ChatlistSubject = new BehaviorSubject<ChatListVM[]>([]);
  private FriendRequestSubject = new BehaviorSubject<User[]>([]);

  //observable
  public chatListData = this.ChatlistSubject.asObservable();
  public friendRequestListData = this.FriendRequestSubject.asObservable();

  updateChatListData(data: ChatListVM[]){
    this.ChatlistSubject.next(data);
  }

  updateFriendRequestData(data: User[]){
    this.FriendRequestSubject.next(data)
  }
}
