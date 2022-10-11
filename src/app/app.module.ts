import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './component/users/users.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { NewsFeedComponent } from './component/news-feed/news-feed.component';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import { TimeLineComponent } from './component/time-line/time-line.component';
import {FriendsComponent} from "./component/friends/friends.component";

import {EditProfileComponent} from "./component/edit-profile/edit-profile.component";

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    NewsFeedComponent,
    TimeLineComponent,
    FriendsComponent,
    NewsFeedComponent,
    EditProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
