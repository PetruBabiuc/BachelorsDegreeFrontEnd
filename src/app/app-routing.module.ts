import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  HomeComponent,
  LoginComponent,
} from './component';
// import { AuthGuard } from './helper/auth.guard';

const routes: Routes = [
  // Home
  { path: 'home', component: HomeComponent },
  // canActivate: [AuthGuard] 

  // Account routes
  { path: 'login', component: LoginComponent },
  // { path: 'account/register', component: RegisterComponent },

  // Redirect to home in case of unmapped path
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
