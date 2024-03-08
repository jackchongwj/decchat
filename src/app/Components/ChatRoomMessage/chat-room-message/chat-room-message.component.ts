import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { ChatRoomMessages } from '../../../Models/DTO/ChatRoomMessages/chatroommessages';
import { LocalstorageService } from '../../../Services/LocalStorage/local-storage.service';
import { MessageService } from '../../../Services/MessageService/message.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserProfileUpdate } from '../../../Models/DTO/UserProfileUpdate/user-profile-update';

@Component({
  selector: 'app-chat-room-message',
  templateUrl: './chat-room-message.component.html',
  styleUrl: './chat-room-message.component.css'
})
export class ChatRoomMessageComponent implements OnInit {

  @ViewChild('scroll') myScrollContainer !: ElementRef;

  constructor(
    private _dataShareService: DataShareService,
    private _messageService: MessageService,
    private _signalRService: SignalRService,
    private lsService: LocalstorageService,
    private sanitizer: DomSanitizer
  ) { }

  currentChatRoom = {} as ChatListVM;
  currentUser = Number(this.lsService.getItem("userId"));
  messageList: ChatRoomMessages[] = [];
  searchMessageList: ChatRoomMessages[] = [];
  searchValue: string = '';
  totalSearch: number = 0;
  currenSearch: number = 0;
  lastHighlightedText: string = '';
  currentMessageMatches: { start: number, end: number }[] = [];
  positions: number[] = []
  currentPossition: number = 0;
  searchPositions: { message: ChatRoomMessages, position: number }[] = [];


  ngOnInit() {

    // Get Chosen Chat Room
    this._dataShareService.selectedChatRoomData
      .subscribe(chatroom => {
        if (this.currentChatRoom?.ChatRoomId != chatroom.ChatRoomId) {
          this.currentChatRoom = chatroom;

          // HTTP Get Message Service
          this._messageService.getMessage(this.currentChatRoom.ChatRoomId, 0, true).subscribe(response => {

            this.messageList = response;
            this.messageList.reverse();

            this.scrollLast();

          }, error => {
            console.error('Error fetching messages:', error);
          });

        }
      });

    this._dataShareService.SearchMessageValue.subscribe(value => {
      this.searchValue = value;

      if (this.searchValue != "") {
        this.searchMessage();
      } else {
        this.totalSearch = 0;
        this._dataShareService.updateTotalSearchMessageResult(this.totalSearch);
      }
    });

    this.updateMessageListenerListener();
    this.deleteMessageListener();
    this.editMessageListener();
    this.ProfileDetailChanges();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const target = event.target as HTMLElement;

    if (target.scrollTop <= 10) {
      const referenceMessage = this.myScrollContainer.nativeElement.firstElementChild;

      setTimeout(() => {
        this._messageService.getMessage(this.currentChatRoom.ChatRoomId, this.messageList[0].MessageId!, true).subscribe(response => {

          if (response && response.length > 0) {
            response.reverse().pop();
            this.messageList.unshift(...response);

            // Adjusting scroll position after new messages are loaded
            setTimeout(() => {
              referenceMessage?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
            }, 100);
          }

          if (this.totalSearch != 0) {
            this.FilterSearch()
          }

        }, error => {
          console.error('Error fetching messages:', error);
        });
      }, 500);
    }
  }

  private scrollLast(): void {
    setTimeout(() => {
      const lastElement = this.myScrollContainer.nativeElement.lastElementChild;
      lastElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }


  isUserSend(message: ChatRoomMessages): boolean {
    if (message.UserId == this.currentUser) {
      return true;
    }
    else {
      return false;
    }
  }

  isPureMessage(message: ChatRoomMessages): boolean {
    return message.ResourceUrl == '' && message.ResourceUrl == null ? true : false;
  }

  hasMessage(message: ChatRoomMessages): boolean {
    return message.Content != '' || message.Content != null ? true : false;
  }

  isImage(fileName: ChatRoomMessages): boolean {
    return /\.(jpg|jpeg|png|jfif|pjpeg|pjp|webp)$/i.test(fileName.ResourceUrl);
  }

  isVideo(fileName: ChatRoomMessages): boolean {
    return /\.(mp4)$/i.test(fileName.ResourceUrl);
  }

  getFileNameFromUrl(url: string) {

    // Get the pathname by split '/'
    const segments = url.split('/');

    // Take last segment (Date-filename)
    const lastSegment = segments.pop() || '';

    // Take filename
    const fileName = lastSegment.split('-').pop();

    return fileName || '';
  }

  isDocument(fileName: ChatRoomMessages): boolean {
    return /\.(pdf|docx?|doc?|txt)$/i.test(fileName.ResourceUrl);
  }

  isAudio(fileName: ChatRoomMessages): boolean {
    return /\.(mp3)$/i.test(fileName.ResourceUrl);
  }

  playVideo(data: ChatRoomMessages): void {
    window.open(data.ResourceUrl, '_blank');
  }

  openDocument(message: ChatRoomMessages): void {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(message.ResourceUrl)}&embedded=true`
    window.open(viewerUrl, '_blank');
  }

  downloadDocument(message: ChatRoomMessages): void {
    const a = document.createElement('a');
    a.href = message.ResourceUrl;
    const filename = this.getFileNameFromUrl(message.ResourceUrl);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  FilterSearch(): void {
    this.searchMessageList = this.messageList.filter(message =>
      message.Content.toLowerCase().includes(this.searchValue.toLowerCase())
    );

    this.positions = this.searchMessageList.map(item => this.messageList.indexOf(item));

    console.log("p", this.positions);
  }

  private updateMessageListenerListener(): void {
    this._signalRService.updateMessageListener()
      .subscribe((newResults: ChatRoomMessages) => {
        if (newResults.ChatRoomId == this.currentChatRoom.ChatRoomId) {
          this.messageList.push(newResults);
          this.scrollLast();
        }

      });
  }

  private deleteMessageListener(): void {
    this._signalRService.deleteMessageListener()
      .subscribe((deletedMessage: number) => {

        this.messageList = this.messageList.filter(message => message.MessageId != deletedMessage);

      });
  }

  private editMessageListener(): void {
    this._signalRService.editMessageListener()
      .subscribe((edittedMessage: ChatRoomMessages) => {
        this.messageList = this.messageList.map(message => {
          if(message.MessageId == edittedMessage.MessageId){
            return { ...message, Content: edittedMessage.Content };
          }
          return message;
        })
      });
  }

  private searchMessage(): void {

    this.FilterSearch()

    //get total search
    this._messageService.getSearch(this.currentChatRoom.ChatRoomId, this.searchValue).subscribe(response => {
      this.totalSearch = response
      if (this.totalSearch > 0) {
        this._dataShareService.updateTotalSearchMessageResult(this.totalSearch);
      }
    });

  }


  highlightSearchText(messageContent: string, message: ChatRoomMessages): SafeHtml {
    if (this.searchValue.trim() === '' || this.totalSearch == 0 ) {
      return this.sanitizer.bypassSecurityTrustHtml(messageContent);
    } 

      const regex = new RegExp(this.searchValue, 'i');
      this._dataShareService.currentSearchMessageResult.subscribe(value => {
        this.currentPossition = value;
      });


      if (this.totalSearch !== 0 && this.positions.length === 0 || this.currentPossition > this.positions.length) {
        this.myScrollContainer.nativeElement.firstElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return this.sanitizer.bypassSecurityTrustHtml(messageContent);
      }

      const lastPosition = this.positions[this.positions.length - this.currentPossition];
      if (this.messageList.indexOf(message) === lastPosition) {
        const highlightedText = messageContent.replace(regex, match => `<mark style="background-color: yellow;">${match}</mark>`);
        this.myScrollContainer.nativeElement.children[lastPosition].scrollIntoView({ behavior: 'smooth', block: 'start' });
        return this.sanitizer.bypassSecurityTrustHtml(highlightedText);

      } else {
        const highlightedText = messageContent.replace(regex, match => `<mark style="background-color: lightblue">${match}</mark>`);
        return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
      }
  }

  private ProfileDetailChanges(): void {
    this._signalRService.profileUpdateListener().subscribe({
      next: (updateInfo: UserProfileUpdate) => {
        this.messageList.forEach((chat) => {
          if (chat.UserId === updateInfo.UserId) {
            if (updateInfo.ProfileName) {
              chat.ProfileName = updateInfo.ProfileName;
            }
            if (updateInfo.ProfilePicture) {
              chat.ProfilePicture = updateInfo.ProfilePicture;
            }
          }
        });
      },
      error: (error) => console.error('Error listening for profile updates:', error),
    });
  }
}
