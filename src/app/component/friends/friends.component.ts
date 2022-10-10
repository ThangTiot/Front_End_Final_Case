import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {ActivatedRoute} from "@angular/router";
import {RelationshipService} from "../../service/relationship.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  id: any;
  idUserPresent!: any;
  listMutualFriend!: User[];
  constructor(private routerActive:ActivatedRoute,
              private relationshipService: RelationshipService) { }

  ngOnInit(): void {
    this.routerActive.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
    })
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.getMutualFriends();
  }
  getMutualFriends(){
    if(this.id){
      this.relationshipService.findMutualFriends(this.idUserPresent, this.id).subscribe(mutualFriends =>{
        this.listMutualFriend = mutualFriends;
      })
    }
  }

}
