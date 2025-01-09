import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule} from '@angular/material/select';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { HotToastModule } from '@ngneat/hot-toast';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { provideFirestore,getFirestore } from '@angular/fire/firestore';



import { CountUpModule } from 'ngx-countup';
import { CommonModule, DatePipe } from '@angular/common';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AuthenticationPageComponent } from './components/authentication-page/authentication-page.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { GameManagementComponent } from './components/game-management/game-management.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import * as THREE from 'three';
import { CubeComponent } from './components/cube/cube.component';
import { HomeComponent } from './components/home/home.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { ImportFromFileComponent } from './components/import-from-file/import-from-file.component';
import { SearchFilterPipe } from './shared/pipes/search-filter.pipe';
import { GameProfilePageComponent } from './components/game-profile-page/game-profile-page.component';
import { OptionsComponent } from './components/options/options.component';
import { FeaturedComponent } from './components/featured/featured.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { SwiperModule } from "swiper/angular";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NotFoundPageComponent,
    AuthenticationPageComponent,
    UserManagementComponent,
    GameManagementComponent,
    AdminPageComponent,
    NavigationComponent,
    CubeComponent,
    HomeComponent,
    GameListComponent,
    ImportFromFileComponent,
    SearchFilterPipe,
    GameProfilePageComponent,
    OptionsComponent,
    FeaturedComponent,
    ProfileComponent,
    LeaderboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    SwiperModule,
    MatInputModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    CountUpModule,

    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    HotToastModule.forRoot(),
    CommonModule,
    LayoutModule,
    NgxChartsModule
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}