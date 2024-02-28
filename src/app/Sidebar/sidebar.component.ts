import { Component, NgZone, OnInit } from '@angular/core';
import { DataShareService } from '../Services/ShareDate/data-share.service';
import { UserService } from '../Services/UserService/user.service';
import { UserProfileComponent } from '../UserProfile/user-profile.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Console } from 'console';

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

    this._dataShareService.IsSelectedData.subscribe( selected => {
      this.IsSelected = selected;
    });
  }


  
}
