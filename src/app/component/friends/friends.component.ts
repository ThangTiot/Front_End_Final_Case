import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {ActivatedRoute} from "@angular/router";
import {RelationshipService} from "../../service/relationship.service";
import {UsersService} from "../../service/users.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  id: any;
  idUserPresent!: any;
  user!: User;
  listMutualFriend!: User[];
  friendList!: User[];
  friendListConfirmTo!: User[];
  friendListConfirmFrom!: User[];
  constructor(private routerActive:ActivatedRoute,
              private relationshipService: RelationshipService,
              private userService: UsersService) { }

  ngOnInit(): void {
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.routerActive.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.userService.findById(this.id).subscribe((data)=>{
        this.user = data})
    })
    this.getMutualFriends();
    this.getAllFriend();
  }
  getMutualFriends(){
    if(this.id){
      this.relationshipService.findMutualFriends(this.idUserPresent, this.id).subscribe(mutualFriends =>{
        this.listMutualFriend = mutualFriends;
      });
    }
  }
  getAllFriend() {
    if (this.idUserPresent) {
      this.userService.findAllFriend(this.idUserPresent).subscribe(listFriend => {
        this.friendList = listFriend;
      });
      this.userService.findAllFriendConfirmTo(this.idUserPresent).subscribe(listFriendConfirmTo => {
        this.friendListConfirmTo = listFriendConfirmTo;
      });
      this.userService.findAllFriendConfirmFrom(this.idUserPresent).subscribe(listFriendConfirmFrom => {
        this.friendListConfirmFrom = listFriendConfirmFrom;
      });
    }
  };

}
