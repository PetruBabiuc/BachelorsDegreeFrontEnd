import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AddSongComponent,
  CrawlerStateComponent,
  HomeComponent,
  LoginComponent,
  OwnSongsComponent,
  StartCrawlingComponent,
} from './component';
import { IsNotLoggedService, IsSimpleUserService } from './service/page-guard';

const routes: Routes = [
  // Home
  { path: 'home', component: HomeComponent },
  // canActivate: [AuthGuard] 

  // Account
  { path: 'login', component: LoginComponent, canActivate: [IsNotLoggedService] },
  // { path: 'account/register', component: RegisterComponent },

  // Songs
  { path: 'own-songs', component: OwnSongsComponent, canActivate: [IsSimpleUserService] },
  { path: 'add-song', component: AddSongComponent, canActivate: [IsSimpleUserService] },

  // Crawler
  { path: 'start-crawling', component: StartCrawlingComponent, canActivate: [IsSimpleUserService] },
  { path: 'crawler-status', component: CrawlerStateComponent, canActivate: [IsSimpleUserService] },

  // Redirect to home in case of unmapped path
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
