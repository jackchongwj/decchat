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
  private SelectedChatMessageHistory = new BehaviorSubject<ChatListVM[]>([]);
  private CurrentLoginUserProfileName = new BehaviorSubject<string>("PendingBackend");

  // Observable for widely use
  public chatListData = this.ChatlistSubject.asObservable();
  public selectedChatRoomData = this.SelectedChatRoom.asObservable();
  public ChatHistory = this.SelectedChatMessageHistory.asObservable();
  public LoginUserProfileName = this.CurrentLoginUserProfileName.asObservable();

  updateChatListData(data: ChatListVM[]){
    this.ChatlistSubject.next(data);
  }

  updateSelectedChatRoom(data: ChatListVM){
    this.SelectedChatRoom.next(data);
    this.clearChatMessageHistory();
  }

  updateChatMessage(data:ChatListVM[]){
    this.SelectedChatMessageHistory.next(data);
  }
  
  updateLoginUserPN(data:string){
    this.CurrentLoginUserProfileName.next(data);
  }

  appendChatMessage(message: ChatListVM){
    const currentMessages = this.SelectedChatMessageHistory.getValue();
    this.SelectedChatMessageHistory.next([...currentMessages, message]);
  }

  // Clears the chat message history
  private clearChatMessageHistory() {
    this.SelectedChatMessageHistory.next([]);
  }
}
