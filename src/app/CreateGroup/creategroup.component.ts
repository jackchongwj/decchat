import { Component} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import the NzSelectModule
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { tap } from 'rxjs';
import { Group } from '../Models/DTO/Group/group';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrl: './creategroup.component.css'
})

export class CreategroupComponent {
  isVisible = false;
  privateChat: ChatListVM[] = [];
  RoomName: string = '';
  selectedUsers: number[] = []; // Use an array to store selected user IDs

  constructor(
    private chatlistService: ChatlistService, //privatelist
    private localStorage: LocalstorageService
  ) {}

  private userId: number = parseInt(this.localStorage.getItem('userId') || '');

  ngOnInit(): void {
    this.chatlistService.getChatListByUserId(this.userId).subscribe(
      {next: (res)=> {
      this.privateChat = res.filter(
        (chat:any) => chat.roomType === false);
    }, 
      error:(err)=>{console.log(err.message)
    }});
  }

  showModal(): void {
    this.isVisible = true;
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
}