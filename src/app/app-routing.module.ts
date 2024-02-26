import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Pages/Auth/Login/login.component';
import { RegisterComponent } from './Pages/Auth/Register/register.component';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';
import { ChangePasswordComponent } from './ChangePassword/change-password.component'
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard] ,component : HomepageComponent },
  { path: 'login', component : LoginComponent },
  { path: 'register', component : RegisterComponent},
  { path: 'change-password', component: ChangePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
