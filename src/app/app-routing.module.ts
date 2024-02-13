import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';
import { ChangePasswordComponent } from './ChangePassword/change-password.component'

const routes: Routes = [
  { path: '', component : HomepageComponent },
  { path: 'login', component : LoginComponent },
  { path: 'register', component : RegisterComponent},
  { path: 'change-password', component: ChangePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
