import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { DataShareService } from './Services/ShareDate/data-share.service';
import { LoadingService } from './Services/Loading/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DEChat';
  isCollapsed = false;

  static isBrowser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private dataShareService: DataShareService,
    public loadingService: LoadingService
    ) { AppComponent.isBrowser.next(isPlatformBrowser(platformId)); }

  ngOnInit(): void{
    this.loadingService.hide();
    this.dataShareService.IsSignalRConnection.subscribe(isConnected => {
      if (!isConnected) {
        this.loadingService.show();
      } 
      this.loadingService.hide();
    });
  }
}
