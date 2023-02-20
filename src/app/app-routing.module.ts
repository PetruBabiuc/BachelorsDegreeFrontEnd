import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  HomeComponent,
} from './component';
// import { AuthGuard } from './helper/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Home
  { path: 'home', component: HomeComponent, 
  // canActivate: [AuthGuard] 
},

  // Account routes
  // { path: 'account/login', component: LoginComponent },
  // { path: 'account/register', component: RegisterComponent },

  // Redirect to home in case of unmapped path
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
