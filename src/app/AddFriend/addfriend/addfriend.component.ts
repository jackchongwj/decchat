import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { DialogService } from '../../Services/Dialog/dialog.service';
import { FriendsService } from '../../Services/FriendService/friends.service';
import { UserService } from '../../Services/UserService/user.service';


@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrl: './addfriend.component.css'
})
export class AddfriendComponent{
  isIconVisible: boolean = true;
  isDialogOpen: boolean = false;


  constructor(private dialogService: DialogService){}


  openDialog(): void{
    this.dialogService.openDialog();
  }

  closeDialog(): void{
    this.dialogService.closeDialog();
  }

}
