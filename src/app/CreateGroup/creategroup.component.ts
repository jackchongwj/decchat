import { Component} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import the NzSelectModule
import { LocalstorageService } from '../Services/LocalStorage/local-storage.service';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrl: './creategroup.component.css'
})
export class CreategroupComponent {
  isVisible = false;
  privateChat: any[] = [];
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
      console.log('Group Name:', this.RoomName);
      console.log('Selected Users:', this.selectedUsers);

      // // Send groupName to the backend using the service
      // this.chatlistService.createGroup(this.RoomName).subscribe(
      //   (response) => {
      //     // Handle success response from the backend if needed
      //     console.log('Backend Response:', response);
      //   },
      //   (error) => {
      //     // Handle error response from the backend if needed
      //     console.error('Backend Error:', error);
      //   });
      console.log('Button ok clicked!');
      this.isVisible = false;
    }

    handleCancel(): void {
      console.log('Button cancel clicked!');
      this.isVisible = false;
    }
}