import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { User } from '../../Models/User/user';
import { DialogService } from '../../Services/Dialog/dialog.service';
import { FriendsService } from '../../Services/FriendService/friends.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { UserService } from '../../Services/UserService/user.service';



@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrl: './addfriend.component.css'
})
export class AddfriendComponent implements OnInit{
  isIconVisible: boolean = true;
  isDialogOpen: boolean = false;
  CountgetFriendRequest: any[] = [];
  sharedata: User[] = [];
  stop: boolean = false;

  constructor(private dialogService: DialogService, private usersService: UserService, private dataShareService: DataShareService){}

  ngOnInit(): void {

    console.log("Beginning stop", this.stop);
    if(!this.stop){
      console.log("stop", this.stop);
    this.usersService.getFriendRequest(7)
    .subscribe(response => {
      this.CountgetFriendRequest = response;
      this.sharedata = response;
      console.log("Friend Request Result: ", response);

      //this.dataShareService.updateFriendRequestData(this.sharedata)
    });
     this.stop = true;
     console.log("Ending stop", this.stop);
  }
}

  openDialog(): void{
    this.dialogService.openDialog();
  }

  closeDialog(): void{
    this.dialogService.closeDialog();
  }

}
