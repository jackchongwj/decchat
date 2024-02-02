import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnDestroy, OnInit {

  constructor(private _sService:SignalRService) {}

  ngOnInit(): void {
    this._sService.startConnection();
  }

  ngOnDestroy() {
    this._sService.stopConnection();
  }
}
