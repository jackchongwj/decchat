import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeveloperComponent } from './developer/developer.component';

const routes: Routes = [
  { path: '', component : DeveloperComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
