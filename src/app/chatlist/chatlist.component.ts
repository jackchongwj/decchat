import { AfterViewInit, Component, inject, Inject, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ChatlistService } from '../../app/Services/Chatlist/chatlist.service';
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { Group } from '../Models/DTO/Group/group';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})

export class ChatlistComponent implements OnInit{
  @Input() isCollapsed : boolean = false;
  // showChatList = false;
  // // userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  // privateChat: any[] = [];
  // groupChat: any[] = [];
  // showChatList = false;
  userId = 7;
  privateChat: any[] = [];
  groupChat: any[] = [];

  // constructor(private chatlistService: ChatlistService, private lsService: LocalstorageService, private dataShareService: DataShareService,
    // private signalRService: SignalRService, private localStorage: LocalstorageService) {}
    // private userId: number = parseInt(this.localStorage.getItem('userId') || '');
    

  constructor(private chatlistService: ChatlistService, private signalRService: SignalRService){}

  ngOnInit(): void {
    // Create a Group instance with the userId
    const group = new Group('', [], 0, this.userId); // Assuming other parameters are not relevant here

    this.chatlistService.getChatListByUserId(group).pipe(
      tap(chats => console.log(chats)), 
    ).subscribe((chats: any[]) => {
      
      this.privateChat = chats.filter(chat => chat.RoomType === false);
      console.log(this.privateChat);
      this.groupChat = chats.filter(chat => chat.RoomType === true);
      console.log(this.groupChat);  
    });

    this.signalRService.addNewGroupListener().subscribe(chatListVM => {
      console.log('Received new group4 :', chatListVM);
      // Add the new room to the groupChat array
      this.groupChat.push(chatListVM);

    });
  }
}


  // getChatList(){
  //   if (!this.privateChat || this.privateChat.length === 0 || !this.groupChat || this.groupChat.length === 0)
  //   {
  //     this.chatlistService.RetrieveChatListByUser(7).pipe(
  //       tap(chats => console.log(chats)), 
  //     ).subscribe((chats: ChatListVM[]) => {
        
  //       this.privateChat = chats.filter(chat => chat.RoomType === false);
  //       console.log(this.privateChat);
  //       this.groupChat = chats.filter(chat => chat.RoomType === true);
  //       console.log(this.groupChat);  

  //       console.log("privateGrouplist", chats);
  //       // this.dataShareService.updateChatListData(chats);
  //       this.signalRService.AddToGroup(chats);
  //     });
  //   }
  // }

  // getSelectedChatRoom(ChatRoom:ChatListVM)
  // {
  //   console.log("get1")
  //   this.dataShareService.updateSelectedChatRoom(ChatRoom);
  //   console.log("chatRoom",ChatRoom);
  //   //console.log(this.lsService.getItem("userId"));
  // }  
  
// }