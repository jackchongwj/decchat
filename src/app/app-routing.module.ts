import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './Homepage/homepage.component';
import { SearchbarComponent } from './Searchbar/searchbar.component';

const routes: Routes = [
  { path: '', component : HomepageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
