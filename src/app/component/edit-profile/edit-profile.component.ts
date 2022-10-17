import {Component, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {User} from "../../model/User";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {UsersService} from "../../service/users.service";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {user} from "@angular/fire/auth";
import {get} from "@angular/fire/database";
import {RelationshipService} from "../../service/relationship.service";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent implements OnInit {
  userPresent!: User;
  formUserInfo!: FormGroup;
  formUserPass!: FormGroup;
  idUserPresent!: any;
  dateOfBirth!: Date;
  checkRepass: boolean = true;
  checkCurrPass : boolean = false;
  user!: User;
  id!: any;
  friendList!: User[];
  friendListConfirmTo!: User[];
  friendListConfirmFrom!: User[];

  constructor(private formBuilder: FormBuilder,
              private storage: AngularFireStorage,
              private userService: UsersService,
              private router: Router,
              private route: ActivatedRoute,
              private relationshipService: RelationshipService,
  ) {

  }

  ngOnInit(): void {
    this.idUserPresent = localStorage.getItem("userPresentId");
    this.formUserInfo = this.formBuilder.group({
        fullName: ["",[Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),Validators.required]],
        phone: [""],
        gender: [""],
        email: ["",[Validators.email]],
        address: [""],
        hobby: [""],
        birthday : [""]
        //   day: [""],
        // month : [""],
        // year : [""]
      }
    );
    this.formUserPass = this.formBuilder.group({
      pass1: ["", [Validators.pattern(/^(?=.*?[A-Z])[A-Za-z0-9]{6,32}$/),Validators.required]],
      rePass: [""],
      currentPass: [""]
    });
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.userService.findById(this.id).subscribe((data)=>{
        this.user = data
      })
    });
    this.getUserPresent();
    this.getAllFriend();
  }
  getUserPresent() {
    if (this.idUserPresent) {
      this.userService.findById(this.idUserPresent).subscribe(data => {
        this.userPresent = data;
        this.formUserInfo.patchValue(data)
      });
    }
  };
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
  updateUserInfo() {
    let user = {
      fullName: this.formUserInfo.value.fullName,
      phone: this.formUserInfo.value.phone,
      gender: this.formUserInfo.value.gender,
      email: this.formUserInfo.value.email,
      address: this.formUserInfo.value.address,
      hobby: this.formUserInfo.value.hobby,
      day: this.formUserInfo.value.birthday
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You will not be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update!'
    }).then((result) => {
      if (result.isConfirmed) {
       this.userService.updateUser(this.idUserPresent,user).subscribe(() => {
         location.reload();
       })
      }
    })
  }

  updateUserPass() {
    let passCheck = this.formUserPass.value.currentPass;
    if (this.userPresent.pass == passCheck) {
      let user = {
        pass: this.formUserPass.value.pass1,
      };
      this.userService.updateUser(this.idUserPresent, user).subscribe(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Update Success!',
          showConfirmButton: false,
          timer: 1500
        }).then(r => location.reload())
      });
    } else {
      this.checkCurrPass = true;
    }
  }
  checkRePass() {
    let pass = this.formUserPass.value.pass1;
    let repass = this.formUserPass.value.rePass;
    if (pass != repass) {
      if (repass == "") {
        this.checkRepass = true;
      } else {
        this.checkRepass = false;
      }
    } else {
      this.checkRepass = true;
    }
  }

  showUserForm() {
    // @ts-ignore
    document.getElementById("user-about").style.display = "none"
    // @ts-ignore
    document.getElementById("user-info").style.display = "block"
    // @ts-ignore
    document.getElementById("user-pass").style.display = "none"
    // @ts-ignore
  }

  showPassForm() {
    // @ts-ignore
    document.getElementById("user-about").style.display = "none"
// @ts-ignore
    document.getElementById("user-info").style.display = "none"
    // @ts-ignore
    document.getElementById("user-pass").style.display = "block"
  }

  showUserAbout() {
// @ts-ignore
    document.getElementById("user-about").style.display = "block"
    // @ts-ignore
    document.getElementById("user-info").style.display = "none"
    // @ts-ignore
    document.getElementById("user-pass").style.display = "none"
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

  addFriend(idUser: any) {
    let relationship = {
      usersFrom: {
        id: this.idUserPresent,
      },
      usersTo: {
        id: idUser,
      }
    }
    this.relationshipService.addFriend(relationship).subscribe(() => {
      this.checkFriend();
      this.getAllFriend();
    });
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
        });
      }
    })
  }

  deleteRequest() {
    this.relationshipService.unfriend(this.idUserPresent, this.id).subscribe(() => {
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

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('').then(() => {
          localStorage.clear();
          location.reload()
        });
      }
    })
  }
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  reload() {
    location.reload();
  }
}
