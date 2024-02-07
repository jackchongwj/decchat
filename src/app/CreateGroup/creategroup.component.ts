import { Component} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import the NzSelectModule
import { ChatListVM } from '../Models/DTO/ChatList/chat-list-vm';
import { tap } from 'rxjs';

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
  ) {}

  ngOnInit(): void {

    this.chatlistService.RetrieveChatListByUser(7).pipe(
      tap(chats => console.log(chats)), 
    ).subscribe((chats: ChatListVM[]) => {
      console.log("Friends Subscribed: "+ chats);
      this.privateChat = chats;
    });

    // this.chatlistService.RetrieveChatListByUser(7).subscribe(
    //   {next: (res)=> {
    //   this.privateChat = res.filter(
    //     (chat:any) => chat.roomType === false);
    // }, 
    //   error:(err)=>{console.log(err.message)
    // }});
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
