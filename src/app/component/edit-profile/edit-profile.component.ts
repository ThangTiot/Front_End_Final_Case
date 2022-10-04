import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/User";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {UsersService} from "../../service/users.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  userPresent!: User;
  formCreatePost!: FormGroup;
  idUserPresent!: any;
  constructor(   private formBuilder: FormBuilder,
                 private storage: AngularFireStorage,
                 private userService: UsersService,
                 private router: Router) {

  }


  ngOnInit(): void {
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.getUserPresent();
  }
  getUserPresent() {
    if (this.idUserPresent) {
      this.userService.findById(this.idUserPresent).subscribe(data => {
        this.userPresent = data;
      });
    }
    this.formCreatePost = this.formBuilder.group({
      content: ["", Validators.required]
    })
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
        this.router.navigateByUrl('').then(() => location.reload());
      }
    })
  }
}
