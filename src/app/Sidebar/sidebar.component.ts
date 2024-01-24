import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor(){}

  isCollapsed = false;
  imageUrl: string = 'https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/beagle-2024’-‘01’-‘23’T’09’:’29’:’45.webp';

  ngOnInit(){
  }
}
