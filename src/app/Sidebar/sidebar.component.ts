import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed = false;
  imageUrl: string = 'https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/beagle-2024’-‘01’-‘23’T’09’:’29’:’45.webp';
}
