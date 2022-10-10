import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./component/users/users.component";
import {NewsFeedComponent} from "./component/news-feed/news-feed.component";
import {EditProfileComponent} from "./component/edit-profile/edit-profile.component";
import {EditPasswordComponent} from "./component/edit-password/edit-password.component";
import {UserAboutComponent} from "./component/user-about/user-about.component";

const routes: Routes = [

  { path: '', component: UsersComponent },
  { path: 'newsFeed', component: NewsFeedComponent },
  { path: 'edit-profile/:id', component: EditProfileComponent },
  { path: 'edit-password/:id', component: EditPasswordComponent },
  { path: 'user-about/:id', component: UserAboutComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {useHash: true} ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
