import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';
import { ChangePasswordComponent } from './ChangePassword/change-password.component'


const routes: Routes = [
  { path: '', component : HomepageComponent},
  { path: 'change-password', component: ChangePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
