import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chatroom } from '../../Models/ChatRoom/chatroom';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  // BehaviorSubject for immediate access of current value
  private ChatlistSubject = new BehaviorSubject<ChatListVM[]>([]);
  private SelectedChatRoom = new BehaviorSubject<ChatListVM>({} as ChatListVM); 
  private IsTyping = new BehaviorSubject<boolean>(false);

  // Observable for widely use
  public chatListData = this.ChatlistSubject.asObservable();
  public selectedChatRoomData = this.SelectedChatRoom.asObservable();
  public UserTyping = this.IsTyping.asObservable();

  updateChatListData(data: ChatListVM[]){
    this.ChatlistSubject.next(data);
  }

  updateSelectedChatRoom(data: ChatListVM){
    this.SelectedChatRoom.next(data);
  }

  updateTypingStatus(typing: boolean){
    this.IsTyping.next(typing);
  }

  clearSelectedChatRoom()
  {
    this.SelectedChatRoom.next({} as ChatListVM);
  }
}
