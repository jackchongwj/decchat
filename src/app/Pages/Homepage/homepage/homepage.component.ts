import { Component,OnInit, OnDestroy} from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnDestroy,OnInit{

  constructor(private signalRService: SignalRService, private dataShareService: DataShareService){}
  private receivedData: ChatListVM[] = [];

  ngOnInit(): void{
    // this.dataShareService.chatListData.subscribe(data => {
    //   this.receivedData = data;
    //   console.log('received Data:', this.receivedData);

    //   if(this.receivedData.length >= 0){
    //     this.signalRService.startConnection(this.receivedData);
    //   }
    // });

    this.signalRService.startConnection();
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection()
  }
}
