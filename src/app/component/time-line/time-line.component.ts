import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../service/users.service";

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent implements OnInit {

  idUserPresent!: any;
  constructor(
    private userService: UsersService) {

  }

  ngOnInit(): void {
    this.idUserPresent = sessionStorage.getItem("userPresentId");
  }

}
