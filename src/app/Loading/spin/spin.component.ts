import { Component } from '@angular/core';
import { LoadingService } from '../../Services/Loading/loading.service';

@Component({
  selector: 'app-spin',
  templateUrl: './spin.component.html',
  styleUrl: './spin.component.css'
})
export class SpinComponent {
  isLoading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}
