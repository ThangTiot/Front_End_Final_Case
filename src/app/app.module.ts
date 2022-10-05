import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './component/users/users.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import { NewsFeedComponent } from './component/news-feed/news-feed.component';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireAuth, AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";

import { EditPasswordComponent } from './component/edit-password/edit-password.component';
import {EditProfileComponent} from "./component/edit-profile/edit-profile.component";
import { UserAboutComponent } from './component/user-about/user-about.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    NewsFeedComponent,
    EditProfileComponent,
    EditPasswordComponent,
    UserAboutComponent
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
