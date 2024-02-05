import { Component, NgZone, OnInit } from '@angular/core';
import { SignalRService } from '../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor(private ngZone: NgZone){}

  isCollapsed = false;
  imageUrl: string = 'https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-29T11:42:23-beagle.png';

  
  ngOnInit(){
  }

  
}
