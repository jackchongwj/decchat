import { AfterViewInit, Component, inject, Inject, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../chatlist.service';
<<<<<<< HEAD
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
=======
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
>>>>>>> origin/master

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})

export class ChatlistComponent implements OnInit{
  @Input() isCollapsed : boolean = false;
  showChatList = false;
  userId = 7;
  privateChat: any[] = [];
  groupChat: any[] = [];
<<<<<<< HEAD
  
  constructor(private chatlistService: ChatlistService, private lsService: LocalstorageService, private dataShareService: DataShareService) {}
=======

  constructor(private chatlistService: ChatlistService, private dataShareService: DataShareService) {}
>>>>>>> origin/master

  ngOnInit(): void {
  //   this.chatlistService.getChatListByUserId(this.userId).pipe(
  //     tap(chats => console.log(chats)), 
  //   ).subscribe((chats: ChatListVM[]) => {
      
  //     this.privateChat = chats.filter(chat => chat.RoomType === false);
  //     this.groupChat = chats.filter(chat => chat.RoomType === true);  

  //     // this.privateChat = chats.RoomType === false ? [chats] : [];
  //     // this.groupChat = chats.RoomType === true ? [chats] : [];  

  //     console.log("privateGrouplist", chats);
  //     this.dataShareService.updateChatListData(chats);
  // });
}

getChatList(){
  if (!this.privateChat || this.privateChat.length === 0 || !this.groupChat || this.groupChat.length === 0)
  {
    this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
      tap(chats => console.log(chats)), 
    ).subscribe((chats: ChatListVM[]) => {
      
      this.privateChat = chats.filter(chat => chat.RoomType === false);
      console.log(this.privateChat);
      this.groupChat = chats.filter(chat => chat.RoomType === true);
      console.log(this.groupChat);  

      console.log("privateGrouplist", chats);
      this.dataShareService.updateChatListData(chats);
    });
  }

<<<<<<< HEAD
  getChatList(){
    if (!this.privateChat || this.privateChat.length === 0 || !this.groupChat || this.groupChat.length === 0)
    {
      this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
        tap(chats => console.log(chats)), 
      ).subscribe((chats: any[]) => {
        
        this.privateChat = chats.filter(chat => chat.roomType === false);
        console.log(this.privateChat);
        this.groupChat = chats.filter(chat => chat.roomType === true);
        console.log(this.groupChat);  

        console.log("privateGrouplist", chats);
        this.dataShareService.updateChatListData(chats);
      });
    }
  }  

  getSelectedChatRoom(chatRoomId:number)
  {
    
    console.log(this.lsService.getItem("userId"));
  }
=======
}  
>>>>>>> origin/master
}
