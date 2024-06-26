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
import { Message } from '../Models/Message/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GroupMemberList } from '../Models/DTO/GroupMember/group-member-list';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrl: './creategroup.component.css'
})
export class CreategroupComponent implements OnInit {
  isVisible = false;
   privateChat: any[] = [];
  // privateChat: ChatListVM[] = [];
  roomName: string = '';
  selectedUsers: number[] = []; // Use an array to store selected user IDs
  InitiatedBy = this.localStorage.getUserId();
  groupChats: any[] = [];
  @Input() isCollapsed: boolean = false;

  constructor(
    private chatlistService: ChatlistService, //privatelist
    private localStorage: LocalstorageService,
    private signalRService: SignalRService,
    private message: NzMessageService // Inject NzMessageService
  ) { }

  private userId: number = this.localStorage.getUserId();

  ngOnInit(): void { 
  }

  showModal(): void {
    this.isVisible = true;
    this.getFriendList();

  }

  //Create group validation
  handleOk(): void {

    // Validate group name
    if (!this.roomName || !this.roomName.trim()) {
      // Show error message
      this.message.error('Please enter a group name.');
      return; // Exit the method
    }

    if (this.selectedUsers.length < 2) {
      // Show error message
      this.message.error('Please select at least 2 users to create a group.');
      return; // Exit the method
    }

    // Create a Group instance with the data
    const newGroup = new Group(this.roomName.trim(), this.selectedUsers, this.InitiatedBy, 0); // Assuming UserId is not relevant here

    // Send data to the backend
    this.chatlistService.createNewGroup(newGroup).subscribe({
      next: (response) => {
        // Handle the response from the backend if needed
        this.message.success('Group created successfully');
        this.roomName = '';
        this.selectedUsers = [];
      },
      error: (error) => {
        console.log('Error from the backend:', error);
      }
    });

    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.selectedUsers = [];
  }

  getFriendList() { 
    this.chatlistService.RetrieveChatListByUser().pipe(
      tap(),
    ).subscribe((chats: ChatListVM[]) => {
      this.privateChat = chats.filter(chat => chat.RoomType === false);
    });
  }  
} 