import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { HomepageComponent } from './Pages/Homepage/homepage/homepage.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuard] ,component : HomepageComponent },
  { path: 'login', component : LoginComponent },
  { path: 'register', component : RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
