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

  constructor(
    private signalRService: SignalRService,
    private dataShareService: DataShareService)
  {}

  isSignalRConnection : boolean = false

  ngOnInit(): void{
    this.dataShareService.checkLogin.subscribe(data => {
      console.log("d",data)
      if (!isNaN(data) && data != 0){
        this.signalRService.startConnection(data);
      }
    })

    this.dataShareService.IsSignalRConnection.subscribe(data => {
      this.isSignalRConnection = data
    })
  }

  ngOnDestroy(): void {
  }
}
