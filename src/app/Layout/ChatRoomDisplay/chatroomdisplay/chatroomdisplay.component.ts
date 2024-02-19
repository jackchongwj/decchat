import { Component, OnInit } from '@angular/core';


interface TypingStatus{
  userName:string;
  isTyping:boolean;
}

@Component({
  selector: 'app-chatroomdisplay',
  templateUrl: './chatroomdisplay.component.html',
  styleUrl: './chatroomdisplay.component.css'
})
export class ChatRoomDisplayComponent implements OnInit {

  constructor(){}

  ngOnInit(){
  }
}
