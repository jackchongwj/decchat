import { Component,OnInit, OnDestroy} from '@angular/core';
import { LoadingService } from '../../Services/Loading/loading.service';
import { LocalstorageService } from '../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent implements OnInit{

  constructor(
    private signalRService: SignalRService,
    private dataShareService: DataShareService,
    private localStorage: LocalstorageService,
    private loadingService: LoadingService)
  {}

  isConnected : boolean = false
  private userId: number = this.localStorage.getUserId();
  
  ngOnInit(): void{
    this.isConnected = false;

    if (!isNaN(this.userId) && this.userId != 0) {
      this.signalRService.startConnection();
    }

    this.dataShareService.IsSignalRConnection.subscribe(isConnected => {
      this.isConnected = isConnected;
      if (isConnected) {
        this.loadingService.hide();
      }
    });
  }
}
