import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ChatlistService } from '../Services/Chatlist/chatlist.service';
import { NzSelectModule } from 'ng-zorro-antd/select'; // Import the NzSelectModule
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
  InitiatedBy=7; 
  userId: number = 7; // Assuming userId is a number property
  groupChats: any[] = [];

  constructor(
    private chatlistService: ChatlistService, //privatelist
    private signalRService:SignalRService,
  ) {}

  ngOnInit(): void {
    // this.signalRService.startConnection();
    // this.signalRService.addNewGroupListener().subscribe((roomName: string) => {
    //   console.log('New group created 1:', roomName);

    // });

    // this.signalRService.addNewGroupListener();
        
    // this.signalRService.addNewGroupListener((groupChat: any) => {
    //   this.groupChats.push(groupChat); // Update group list when new group is created
    // });
    
     // Create a Group instance with the userId
    //  const group = new Group('', [], 0, this.userId); // Assuming other parameters are not relevant here

     this.chatlistService.RetrieveChatListByUser(this.userId).pipe(
      tap(chats => console.log(chats)), 
    ).subscribe((chats: ChatListVM[]) => {
      console.log("Friends Subscribed: "+ chats);
      this.privateChat = chats.filter(chat => chat.RoomType === false); // Filter by roomType being false    
    });
  }


  // createNewGroup(): void {
  //   this.signalRService.createNewGroup(this.roomName, this.InitiatedBy, this.selectedUsers)
  //     .subscribe(
  //       (res:any) => {
  //         console.log('New group created:' , res);
  //         // Optionally, handle success (e.g., show a notification)
  //       },
  //       error => {
  //         console.error('Error creating group:', error);
  //         // Handle error (e.g., show an error message)
  //       }
  //     );
  // }

  // createNewGroup(): Observable<any> {
  //   return new Observable<any>(observer => {
  //     this.signalRService.createNewGroup(this.roomName, this.InitiatedBy, this.selectedUsers)
  //       // .subscribe({
  //       //   next: (res: any) => {
  //       //     console.log(`New group created 2: ${res}`);
  //       //     // Handle the new group creation, e.g., update UI
  //       //     observer.next(res); // Emit the roomName to observers
  //       //   },
  //       //   error: error => {
  //       //     console.error('Error creating group:', error);
  //       //     observer.error(error); // Emit the error to observers
  //       //   },
  //       //   complete: () => {
  //       //     observer.complete(); // Emit complete event to observers
  //       //   }
  //       // });
  //   });
  // }

  // createNewGroup(): Observable<any> {
  //   return new Observable<any>(observer => {
  //     this.signalRService.createNewGroup(this.roomName, this.InitiatedBy, this.selectedUsers)
  //       .subscribe(
  //         (roomName: any) => {
  //           console.log(`New group created: ${roomName}`);
  //           // Handle the new group creation, e.g., update UI
  //           observer.next(roomName); // Emit the roomName to observers
  //         },
  //         error => {
  //           console.error('Error creating group:', error);
  //           observer.error(error); // Emit the error to observers
  //         },
  //         () => {
  //           observer.complete(); // Emit complete event to observers
  //         }
  //       );
  //   });
  // }

  
    // createNewGroup(): Observable<any> {
    //   return this.signalRService.createNewGroup(this.roomName, this.InitiatedBy, this.selectedUsers)
    //     .subscribe((roomName: any) => {
    //       console.log(`New group created: ${roomName}`);
    //       // Handle the new group creation, e.g., update UI
    //     });
    //   }

    // this.chatlistService.getChatListByUserId(group).subscribe(
    //   {next: (res)=> {
    //     console.log(res);
    //   this.privateChat = res.filter(
    //     (chat:any) => chat.roomType === false);
    // }, 
    //   error:(err)=>{console.log(err.message)
    // }});
  

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
// function createNewGroup() {
//   throw new Error('Function not implemented.');
// }

