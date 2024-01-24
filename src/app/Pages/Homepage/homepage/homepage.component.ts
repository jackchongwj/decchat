import { Component, OnDestroy } from '@angular/core';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnDestroy {

  constructor(private signalRService:SignalRService) {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
  }

  ngOnDestroy() {
    this.signalRService.stopConnection();
  }
}
