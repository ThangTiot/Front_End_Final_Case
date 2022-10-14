import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {ActivatedRoute} from "@angular/router";
import {RelationshipService} from "../../service/relationship.service";
import {UsersService} from "../../service/users.service";
import {TimelineService} from "../../service/timeline.service";
import {Post} from "../../model/Post";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  id: any;
  idUserPresent!: any;
  user!: User;
  posts! : Post[];
  listMutualFriend!: User[];
  friendList!: User[];
  friendListConfirmTo!: User[];
  friendListConfirmFrom!: User[];
  constructor(private routerActive:ActivatedRoute,
              private relationshipService: RelationshipService,
              private userService: UsersService,
              private timelineService: TimelineService) { }

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

  getAllPostOfUser(){
    if (this.idUserPresent == this.id) {
      this.timelineService.findAllById(this.id).subscribe((data1) => {
        this.posts = data1.reverse()
      });
    } else {
      this.timelineService.findPostOfTimeLine(this.id, this.idUserPresent).subscribe(data => {
        this.posts = data.reverse();
      });
    }
  }
  checkFriend(): string {
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].id == this.user.id) {
        return "friend";
      }
    }
    for (let i = 0; i < this.friendListConfirmTo.length; i++) {
      if (this.friendListConfirmTo[i].id == this.user.id) {
        return "cancel request";
      }
    }
    for (let i = 0; i < this.friendListConfirmFrom.length; i++) {
      if (this.friendListConfirmFrom[i].id == this.user.id) {
        return "confirm";
      }
    }
    return "strange";
  }
  deleteRequest(idUser: any) {
    this.relationshipService.unfriend(this.idUserPresent, idUser).subscribe(() => {
      this.checkFriend();
      this.getAllPostOfUser();
      this.getAllFriend();
    });
  }

  confirm(idUser: any) {
    this.relationshipService.confirm(this.idUserPresent, idUser).subscribe(() => {
      this.checkFriend();
      this.getAllPostOfUser();
      this.getAllFriend();
    });
  }
}
