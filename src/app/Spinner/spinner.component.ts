import { Component } from '@angular/core';
import { LoadingService } from '../Services/Loading/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  isLoading$ = this.spinnerService.isLoading$;

  constructor(private spinnerService: LoadingService) {}
}
