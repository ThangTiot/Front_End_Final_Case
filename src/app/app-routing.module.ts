import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from "./component/users/users.component";
import {NewsFeedComponent} from "./component/news-feed/news-feed.component";
import {TimeLineComponent} from "./component/time-line/time-line.component";
import {FriendsComponent} from "./component/friends/friends.component";
import {EditProfileComponent} from "./component/edit-profile/edit-profile.component";
import {LoginSuccessComponent} from "./login-success/login-success.component";

const routes: Routes = [

  { path: '', component: UsersComponent },
  { path: 'loginSuccess', component: LoginSuccessComponent },
  { path: 'newsFeed', component: NewsFeedComponent },
  { path: 'timeLine/:id', component: TimeLineComponent },
  { path: 'friends/:id', component: FriendsComponent },
  { path: 'edit-profile/:id', component: EditProfileComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: false} ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
