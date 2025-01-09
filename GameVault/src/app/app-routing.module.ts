import { GameListComponent } from './components/game-list/game-list.component';
import { HomeComponent } from './components/home/home.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { GameManagementComponent } from './components/game-management/game-management.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticationPageComponent } from './components/authentication-page/authentication-page.component';
import { GameProfilePageComponent } from './components/game-profile-page/game-profile-page.component';
import { OptionsComponent } from './components/options/options.component';
import { FeaturedComponent } from './components/featured/featured.component';

import { ImportFromFileComponent } from './components/import-from-file/import-from-file.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserGuard } from './guards/user.guard';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent },
  {path: 'auth', component:AuthenticationPageComponent},
  // {path: 'signup',component:RegistrationComponent},
  // {path: 'login',component:LoginComponent},
  // {path: 'game', component:GameManagementComponent},
  // {path: 'user', component:UserManagementComponent},
  {path: 'options', component:OptionsComponent, canActivate: [UserGuard]},
  {path: 'featured', component:FeaturedComponent},
  {path: 'games', component:GameListComponent},
  {path: 'game/:id/:name', component:GameProfilePageComponent},
  {path: 'home',component:HomeComponent},
  {path: 'profile', component:ProfileComponent, canActivate: [UserGuard]},
  {path: 'profile/:id/:name', component:ProfileComponent, canActivate: [UserGuard]},
  {path: 'admin', component:AdminPageComponent, canActivate: [AdminGuard]},
  {path: 'leaderboard',component:LeaderboardComponent},
  // This path must stay last
  {path: '**',component:NotFoundPageComponent},
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
