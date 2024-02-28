import { Component, OnInit } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { DeleteFriendRequest } from '../../../Models/DTO/DeleteFriend/delete-friend-request';
import { TypingStatus } from '../../../Models/DTO/TypingStatus/typing-status';
import { FriendsService } from '../../../Services/FriendService/friends.service';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GroupMemberList } from '../../../Models/DTO/GroupMember/group-member-list';
import { GroupMemberServiceService } from '../../../Services/GroupMember/group-member-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChatroomService } from '../../../Services/ChatroomService/chatroom.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent implements OnInit {
  isVisibleDeleteFriendModal: boolean = false; // Visibility property for Delete Friend modal
  isVisibleRemoveUserModal: boolean = false; // Visibility property for Remove User modal
  isVisible: boolean = false;
  userId: number = parseInt(this.localStorage.getItem('userId') || '');
  groupMembers: GroupMemberList[] = [];
  groupChat: ChatListVM[] = [];

  constructor(
    private _dataShareService: DataShareService,
    private friendService: FriendsService,
    private _signalRService: SignalRService,
    private modalService: NzModalService,

    private _chatRoomService: ChatroomService,
    private localStorage: LocalstorageService,
    private groupMemberServiceService: GroupMemberServiceService, 
    private message: NzMessageService // Inject NzMessageService
  ) { }

  private userId1: number = parseInt(this.localStorage.getItem('userId') || '');
  private searchSubject: Subject<string> = new Subject<string>()
  request: DeleteFriendRequest = { ChatRoomId: 0, UserId1: 0, UserId2: 0 };
  currentChatRoom = {} as ChatListVM;
  previousChatRoom = {} as ChatListVM;
  IsCurrentChatUser: boolean = false;
  showDropdown: boolean = false;
  editMode: boolean = false;
  showEditIcon: boolean = false;
  showModal: boolean = false;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  InComingUsers: string[] = [];
  isCurrentUserOnline: boolean = false;
  showSearchBar = false;
  checkChatRoomId: number = 0;
  searchValue: string = '';
  currenResult: number = 0;
  totalResult: number = 0;

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe(chatroom => {
      this.currentChatRoom = chatroom;
      this.IsCurrentChatUser = false;
      //this.subscribeToOnlineStatusUpdates();

      if (this.previousChatRoom.ChatRoomId != this.currentChatRoom.ChatRoomId) {
        this.showSearchBar = false;
        this.currenResult = 0;
        this.totalResult = 0;
        this.searchValue = '';
        this._dataShareService.updateSearchValue(this.searchValue);
        this.previousChatRoom = this.currentChatRoom;
      }

    });

    this.previousChatRoom = this.currentChatRoom;

    this._signalRService.UserTypingStatus().subscribe((status: TypingStatus) => {
      //Check If Current Chat Room
      if (status.ChatRoomId === this.currentChatRoom.ChatRoomId) {
        // For Group Chat
        if (this.currentChatRoom.RoomType) {
          this.IsCurrentChatUser = true;
          if (status.isTyping) {
            // Add the user if they are typing and not already present in the list
            if (!this.InComingUsers.includes(status.currentUserProfileName)) {
              this.InComingUsers.push(status.currentUserProfileName);
            }
          }
          else {
            this.InComingUsers = this.InComingUsers.filter(name => name !== status.currentUserProfileName);
          }
        }
        // For One-On-One Chat
        else {
          this.IsCurrentChatUser = status.isTyping;
        }
      }
      // Different Chat Room
      else {
        this.IsCurrentChatUser = false;
      }

    });

    this.searchSubject.pipe(
      debounceTime(300),
      switchMap((value: string) => {
        this._dataShareService.updateSearchValue(value);
        this.searchValue = value;
        return of(value);
      })
    ).subscribe(response => {
    });

    this._dataShareService.totalSearchMessageResult.subscribe(value => {
      this.totalResult = value;
      if (this.totalResult > 0) {
        this.currenResult = 1;
        this._dataShareService.updateCurrentMessageResult(this.currenResult);
      } else {
        this.currenResult = 0;
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown; // Toggle the visibility of the dropdown
  }

  saveGroupName(): void {
    this._chatRoomService.updateGroupName(this.currentChatRoom.ChatRoomId, this.currentChatRoom.ChatRoomName).subscribe({
      next: () => {
        this.editMode = false;
      },
      error: (error) => {
        console.error('Error updating profile name:', error);
      }
    });
  }

  saveProfilePicture(): void {
    if (this.selectedFile && this.currentChatRoom.ChatRoomId) {
      this._chatRoomService.updateGroupPicture(this.currentChatRoom.ChatRoomId, this.selectedFile).subscribe({
        next: () => {
          this.currentChatRoom.ProfilePicture = this.previewImageUrl || 'default-profile-picture-url.png';
          this.previewImageUrl = null;
          this.showEditIcon = false;
          this.editMode = false;
        },
        error: (error) => {
          console.error('Error uploading file:', error);
        }
      });
    }
  }

  cancelPreview() {
    this.previewImageUrl = null;

    this.selectedFile = null;
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  toggleModal(): void {
    this.showModal = !this.showModal;

    this.groupMemberServiceService.getGroupMembers(this.currentChatRoom.ChatRoomId, this.userId).pipe(
      ).subscribe(groupMembers => {
        this.groupMembers = groupMembers;
      });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];

      if(this.isImage(this.selectedFile.name))
      {
        // Use FileReader to read the file for preview
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.previewImageUrl = e.target?.result as string; 
        };
        reader.readAsDataURL(this.selectedFile);
      }
      else
      {
        this.message.error("Invalid File Format Uploaded");
      }
   
    }
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|jfif|pjpeg|pjp|webp)$/i.test(fileName);
  }

  DeleteFriend(): void {
    this.request = {
      ChatRoomId: this.currentChatRoom.ChatRoomId,
      UserId1: this.userId1,
      UserId2: this.currentChatRoom.UserId
    };

    this.friendService.DeleteFriend(this.request).subscribe(response => {
      this.message.success('Delete Friend successfully');
    });
  }

  // Show or hide Delete Friend modal
  showModalDeleteFriendFn(): void {
    this.isVisibleDeleteFriendModal = true;
  }

  handleOkDeleteFriend(): void {
    this.DeleteFriend();
    this.isVisibleDeleteFriendModal = false;
  }

  handleCancelDeleteFriend(): void {
    this.isVisibleDeleteFriendModal = false;
  }

  //showModalHeader
  showModalHeader(): void {
    this.isVisibleDeleteFriendModal = true;
  }

  showModalRemoveUser(): void {
    this.isVisibleRemoveUserModal = true;

    this.groupMemberServiceService.getGroupMembers(this.currentChatRoom.ChatRoomId, this.userId).pipe(
    ).subscribe(groupMembers => {
      this.groupMembers = groupMembers;
    });
  }

  Delete(userId: number): void {

    this.groupMemberServiceService.removeUser(this.currentChatRoom.ChatRoomId, userId, this.userId).subscribe({
      next: (response) => {
        // Handle the response from the backend if needed
        this.message.success('User removed successfully');
        this.isVisibleRemoveUserModal=false;
      },
      error: (error) => {
        console.log('Error from the backend:', error);
      }
    });
  }

  ExitGroup(): void {
    this.groupMemberServiceService.quitGroup(this.currentChatRoom.ChatRoomId, this.userId).subscribe({
      next: (response) => {
        // Handle the response from the backend if needed
        this.message.success('Group quit successfully');

      },
      error: (error) => {
        console.log('Error from the backend:', error);
      }
    });
  }

  handleOkRemoveUser(): void {
    this.isVisibleRemoveUserModal = false;
  }

  handleCancelRemoveUser(): void {
    this.isVisibleRemoveUserModal = false;
  }

  // private subscribeToOnlineStatusUpdates(): void {
  //   this._signalRService.onlineStatusListener().subscribe((onlineUsers: string[]) => {
  //     if(this.currentChatRoom && onlineUsers.includes(this.currentChatRoom.UserId.toString())) {
  //       this.isCurrentUserOnline = true;
  //     } else {
  //       this.isCurrentUserOnline = false;
  //     }
  //   });
  // }


  //search
  Search(chatRoomid: number) {
    this.checkChatRoomId = chatRoomid;
    this.showSearchBar = true;
  }

  closeSearch() {
    this.showSearchBar = false;
    this.currenResult = 0;
    this.totalResult = 0;
    this.searchValue = '';
    this._dataShareService.updateSearchValue(this.searchValue);
    this._dataShareService.updateCurrentMessageResult(this.currenResult);
  }

  searchMessage(): void {
    this.searchSubject.next(this.searchValue);
  }

  showPreviousSearchResult(): void {
    if (this.currenResult < this.totalResult) {
      this.currenResult++;
      this._dataShareService.updateCurrentMessageResult(this.currenResult);
    }
  }


  showNextSearchResult(): void {
    if (this.currenResult > 1) {
      this.currenResult--;
      this._dataShareService.updateCurrentMessageResult(this.currenResult);
    }
  }

  truncateGroupChatRoomName(ChatRoom:ChatListVM):string{
    if(!ChatRoom.RoomType)
    {
      return ChatRoom.ChatRoomName
    }
    else
    {
      return ChatRoom.ChatRoomName.substring(0,15)+ '...';
    }
  }

}