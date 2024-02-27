import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chatroom } from '../../Models/ChatRoom/chatroom';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { ChatRoomMessages } from '../../Models/DTO/ChatRoomMessages/chatroommessages';
import { User } from '../../Models/User/user';
import { LocalstorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  constructor(
    private lsService:LocalstorageService
  ) {}

  // BehaviorSubject for immediate access of current value
  private ChatlistSubject = new BehaviorSubject<ChatListVM[]>([]);
  private SelectedChatRoom = new BehaviorSubject<ChatListVM>({} as ChatListVM); 
  private CurrentLoginUserProfileName = new BehaviorSubject<string>('');
  private userId = new BehaviorSubject<number>(Number(this.lsService.getItem("userId")));
  private IsSelected =  new BehaviorSubject<boolean>(false);

  // Observable for widely use
  public chatListData = this.ChatlistSubject.asObservable();
  public selectedChatRoomData = this.SelectedChatRoom.asObservable();
  public LoginUserProfileName = this.CurrentLoginUserProfileName.asObservable();
  public checkLogin = this.userId.asObservable();
  public IsSelectedData = this.IsSelected.asObservable();

  updateChatListData(data: ChatListVM[]){
    this.ChatlistSubject.next(data);
  }

  updateSelectedChatRoom(data: ChatListVM){
    this.SelectedChatRoom.next(data);
  }

  updateLoginUserPN(data:string){
    this.CurrentLoginUserProfileName.next(data);
  }

  updateUserId(data:number){
    this.userId.next(data);
  }

  clearSelectedChatRoom(data: boolean)
  {
    this.IsSelected.next(data);
  }
}
