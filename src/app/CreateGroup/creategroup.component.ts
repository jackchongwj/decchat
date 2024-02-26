 import { Component, OnInit, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import the NzSelectModule
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { Group } from '../Models/DTO/Group/group';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { Observable, tap } from 'rxjs';
import { SignalRService } from '../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrl: './creategroup.component.css'
})
export class CreategroupComponent implements OnInit{
  isVisible = false;
  privateChat: any[] = [];
  roomName: string = '';
  selectedUsers: number[] = []; // Use an array to store selected user IDs
  InitiatedBy=Number(this.localStorage.getItem("userId"));
  // userId: number = 7; // Assuming userId is a number property
  groupChats: any[] = [];
  @Input() isCollapsed: boolean = false;

  constructor(
    private chatlistService: ChatlistService, //privatelist
    private localStorage: LocalstorageService,
    private signalRService:SignalRService
  ) {}

  private userId: number = parseInt(this.localStorage.getItem('userId') || '');

  ngOnInit(): void {

    //  this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
    //   tap(chats => console.log(chats)), 
    // ).subscribe((chats: ChatListVM[]) => {
    //   console.log("Friends Subscribed: "+ chats);
    //   this.privateChat = chats.filter(chat => chat.RoomType === false);     
    // });

  }
 
  showModal(): void {
    this.isVisible = true;
    this.getFriendList();
  }

  handleOk(): void {
    console.log('Group Name:', this.roomName);
    console.log('Selected Users:', this.selectedUsers);
    console.log('InitiatedBy:', this.InitiatedBy);

  // Create a Group instance with the data
  const newGroup = new Group(this.roomName, this.selectedUsers, this.InitiatedBy, 0); // Assuming UserId is not relevant here

  // Send data to the backend
  this.chatlistService.createNewGroup(newGroup).subscribe({
    next: (response) => {
      // Handle the response from the backend if needed
      console.log('Backend response:', response);
    },
    error: (error) => {
      console.log('Error from the backend:', error);
    }
  });

    // console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  getFriendList(){
    this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
      tap(chats => console.log(chats)), 
    ).subscribe((chats: ChatListVM[]) => {
      console.log("Friends Subscribed: "+ chats);
      this.privateChat = chats.filter(chat => chat.RoomType === false);     
    });

  }
}
