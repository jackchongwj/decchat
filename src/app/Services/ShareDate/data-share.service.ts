import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chatroom } from '../../Models/ChatRoom/chatroom';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { ChatRoomMessages } from '../../Models/DTO/Messages/chatroommessages';
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
  private SelectedChatMessageHistory = new BehaviorSubject<ChatRoomMessages[]>([]);
  private CurrentLoginUserProfileName = new BehaviorSubject<string>("PendingBackend");
  private userId = new BehaviorSubject<number>(Number(this.lsService.getItem("userId")));

  // Observable for widely use
  public chatListData = this.ChatlistSubject.asObservable();
  public selectedChatRoomData = this.SelectedChatRoom.asObservable();
  public ChatHistory = this.SelectedChatMessageHistory.asObservable();
  public LoginUserProfileName = this.CurrentLoginUserProfileName.asObservable();
  public checkLogin = this.userId.asObservable();

  updateChatListData(data: ChatListVM[]){
    this.ChatlistSubject.next(data);
  }

  updateSelectedChatRoom(data: ChatListVM){
    this.SelectedChatRoom.next(data);
    this.clearChatMessageHistory();
  }

  updateLoginUserPN(data:string){
    this.CurrentLoginUserProfileName.next(data);
  }

  updateChatMessage(data:ChatRoomMessages[]){
    this.SelectedChatMessageHistory.next(data);
  }

  appendChatMessage(message: ChatRoomMessages){
    const currentMessages = this.SelectedChatMessageHistory.getValue();
    this.SelectedChatMessageHistory.next([...currentMessages, message]);
  }

  // Clears the chat message history
  private clearChatMessageHistory() {
    this.SelectedChatMessageHistory.next([]);
  }
}
