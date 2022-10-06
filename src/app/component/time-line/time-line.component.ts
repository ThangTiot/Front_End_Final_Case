import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {Post} from "../../model/Post";
import {TimelineService} from "../../service/timeline.service";
import {UsersService} from "../../service/users.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent implements OnInit {
  id: any;
  timeline: any;
  user!: User;
  posts! : Post[];
  constructor(private timelineService: TimelineService,
              private userService: UsersService,
              private routerActive: ActivatedRoute) { }

  ngOnInit(): void {
    this.routerActive.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.userService.findById(this.id).subscribe((data)=>{
        this.user = data
        console.log(data)
        console.log(this.id)
      })
      this.timelineService.findAllById(this.id).subscribe((data1)=>{
        this.posts = data1
        console.log(data1)
      })
      // this.router.paramMap.subscribe(paramMap => {
      //   this.id = paramMap.get('id');
      //
      //   })
    })
  }

}
