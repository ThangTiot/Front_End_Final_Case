import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {ActivatedRoute} from "@angular/router";
import {RelationshipService} from "../../service/relationship.service";
import {UsersService} from "../../service/users.service";
import {TimelineService} from "../../service/timeline.service";
import {Post} from "../../model/Post";
import Swal from "sweetalert2";

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
    if (this.id) {
      this.userService.findAllFriend(this.id).subscribe(listFriend => {
        this.friendList = listFriend;
      });
      this.userService.findAllFriendConfirmTo(this.id).subscribe(listFriendConfirmTo => {
        this.friendListConfirmTo = listFriendConfirmTo;
      });
      this.userService.findAllFriendConfirmFrom(this.id).subscribe(listFriendConfirmFrom => {
        this.friendListConfirmFrom = listFriendConfirmFrom;
      });
    }
  };

  checkFriend(): string {
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].id == this.idUserPresent) {
        return "friend";
      }
    }
    for (let i = 0; i < this.friendListConfirmTo.length; i++) {
      if (this.friendListConfirmTo[i].id == this.idUserPresent) {
        return "cancel request";
      }
    }
    for (let i = 0; i < this.friendListConfirmFrom.length; i++) {
      if (this.friendListConfirmFrom[i].id == this.idUserPresent) {
        return "confirm";
      }
    }
    return "strange";
  }

  unfriend(idUser: any) {
    Swal.fire({
      title: 'Unfriend ' + this.user.fullName,
      text: "Are you sure want to unfriend " + this.user.fullName + "?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.relationshipService.unfriend(this.idUserPresent, idUser).subscribe(() => {
          this.checkFriend();
          this.getAllFriend();
          this.getMutualFriends()
        });
      }
    })
  }
  deleteRequest(idUser: any) {
    this.relationshipService.unfriend(this.idUserPresent, idUser).subscribe(() => {
      this.checkFriend();
      this.getAllFriend();
    });
  }

  confirm(idUser: any) {
    this.relationshipService.confirm(this.idUserPresent, idUser).subscribe(() => {
      this.checkFriend();
      this.getAllFriend();
    });
  }
}
