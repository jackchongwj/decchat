import { Component } from '@angular/core';
import { LoadingService } from '../Services/Loading/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  isLoading$ = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService) {}
}
