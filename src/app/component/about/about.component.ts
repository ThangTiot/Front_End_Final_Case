import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {UsersService} from "../../service/users.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  user!: User;
  id: any;
  idUserPresent!: any;
  constructor(private userService: UsersService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.idUserPresent = sessionStorage.getItem("userPresentId");

    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.userService.findById(this.id).subscribe((data)=>{
        this.user = data

      })
    })

  }
}
