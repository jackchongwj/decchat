import { Component,OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../Services/Auth/auth.service';
import { LoadingService } from '../../Services/Loading/loading.service';
import { LocalstorageService } from '../../Services/LocalStorage/local-storage.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';
import { TokenService } from '../../Services/Token/token.service';


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
    private loadingService: LoadingService,
    private authService: AuthService,
    private tokenService: TokenService,
    private message: NzMessageService,
    private router: Router)
  {}

  private authCheckSubscription: Subscription = new Subscription;
  isConnected : boolean = false
  private userId: number = this.localStorage.getUserId();
  
  ngOnInit(): void {
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

    // Start an interval to check authentication every 15 minutes
    this.authCheckSubscription = interval(15 * 60 * 1000)
      .pipe(
        switchMap(() => this.authService.isAuthenticated$())
      )
      .subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          this.tokenService.clearTokens();
          this.message.error('Authentication expired. Please log in again.')
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnDestroy(): void {
    // Clean up the interval subscription
    if (this.authCheckSubscription) {
      this.authCheckSubscription.unsubscribe();
    }
  }
}