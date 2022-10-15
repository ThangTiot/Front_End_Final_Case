import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {UsersService} from "../../service/users.service";
import {ActivatedRoute} from "@angular/router";
import {RelationshipService} from "../../service/relationship.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  user!: User;
  id: any;
  idUserPresent!: any;
  allUserNotFriend!: User[];
  constructor(private userService: UsersService,
              private route: ActivatedRoute,
              private relationshipService: RelationshipService) {
  }

  ngOnInit(): void {
    this.idUserPresent = localStorage.getItem("userPresentId");

    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.userService.findById(this.id).subscribe((data)=>{
        this.user = data
      })
    })
  }
}
