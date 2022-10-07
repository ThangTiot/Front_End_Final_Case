import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./component/users/users.component";
import {NewsFeedComponent} from "./component/news-feed/news-feed.component";
import {TimeLineComponent} from "./component/time-line/time-line.component";
import {AboutComponent} from "./component/about/about.component";

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'newsFeed', component: NewsFeedComponent },
  { path: 'timeLine/:id', component: TimeLineComponent },
  { path: 'about/:id', component: AboutComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true} ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
