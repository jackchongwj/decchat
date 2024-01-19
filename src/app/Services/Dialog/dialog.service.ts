import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AddfriendComponent } from '../../AddFriend/addfriend/addfriend.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  dialogAddFriend!: MatDialogRef<AddfriendComponent>;


  constructor(private dialog: MatDialog) { }

  openDialog(){ 
   this.dialogAddFriend = this.dialog.open(AddfriendComponent, {
      width:'600px',
      height:'400px',
      disableClose: true
    });

    this.dialogAddFriend.componentInstance.isIconVisible = false; 
    this.dialogAddFriend.componentInstance.isDialogOpen = true; 
  }
  
  closeDialog(){
    if(this.dialogAddFriend){
      this.dialogAddFriend.close()
      this.dialogAddFriend.componentInstance.isDialogOpen = false; 
    }
  }
}
