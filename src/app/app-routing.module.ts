import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';
import { ChangePasswordComponent } from './ChangePassword/change-password.component'
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { path: '', component : LoginComponent, canActivate : [ AuthGuard ] },
  { path: 'login', component : LoginComponent, canActivate : [ AuthGuard ] },
  { path: 'dashboard', component: HomepageComponent, canActivate : [ AuthGuard ]},
  { path: 'change-password', component: ChangePasswordComponent, canActivate : [ AuthGuard ] },
  { path: 'register', component : RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
