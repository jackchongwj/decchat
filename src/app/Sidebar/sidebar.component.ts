import { Component, NgZone, OnInit } from '@angular/core';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { SignalRService } from '../Services/SignalRService/signal-r.service';
import { UserService } from '../Services/UserService/user.service';
import { UserProfileComponent } from '../UserProfile/user-profile.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})


export class SidebarComponent implements OnInit {

  constructor(private _dataShareService:DataShareService){}

  isCollapsed = false;
  IsSelected: boolean = false;
  
  ngOnInit(){
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      if(chatroom.ChatRoomId && chatroom.ChatRoomName)
      {
        this.IsSelected = true;
      }
    });
  }
  
}
