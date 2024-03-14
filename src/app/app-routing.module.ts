import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Pages/Auth/Login/login.component';
import { RegisterComponent } from './Pages/Auth/Register/register.component';
import { ChangePasswordComponent } from './ChangePassword/change-password.component'
import { AuthGuard } from './Guards/auth.guard';
import { AuthInitGuard } from './Guards/auth-init.guard';
import { HomepageComponent } from './Pages/Homepage/homepage.component';

const routes: Routes = [
  { path: '', component : LoginComponent, canActivate : [ AuthInitGuard, AuthGuard ] },
  { path: 'login', component : LoginComponent, canActivate : [ AuthInitGuard, AuthGuard ] },
  { path: 'dashboard', component: HomepageComponent, canActivate : [ AuthInitGuard, AuthGuard ]},
  { path: 'change-password', component: ChangePasswordComponent, canActivate : [ AuthInitGuard, AuthGuard ] },
  { path: 'register', component : RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
