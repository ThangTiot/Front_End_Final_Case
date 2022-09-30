import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../service/users.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  formSignIn!: FormGroup;
  formSignUp!: FormGroup;
  signInError: boolean = true;
  checkUsername: boolean = true;
  checkRepass: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private userService: UsersService,
              private router: Router) {
  }

  ngOnInit(): void {
    sessionStorage.clear();
    this.formSignIn = this.formBuilder.group(
      {
        id: "",
        userName: "",
        pass: ""
      }
    );
    this.formSignUp = this.formBuilder.group(
      {
        userName1: "",
        pass1: ["", [Validators.pattern(/^(?=.*?[A-Z])[A-Za-z0-9]{6,32}$/)]],
        rePass: "",
        fullName: "",
        gender: ""
      }
    );
  };

  signIn() {
    let user = {
      userName: this.formSignIn.value.userName,
      pass: this.formSignIn.value.pass
    };
    this.userService.signIn(user).subscribe(value => {
      if (value != null) {
        let userPresentId = value.id;
        // @ts-ignore
        sessionStorage.setItem("userPresentId", userPresentId);
        this.router.navigateByUrl('newsFeed').then();
      } else {
        this.signInError = false;
      }
    });
  }

  signUp() {
    let user = {
      fullName: this.formSignUp.value.fullName,
      userName: this.formSignUp.value.userName1,
      pass: this.formSignUp.value.pass1,
      gender: this.formSignUp.value.gender,
    };
    this.userService.signUp(user).subscribe(value => {
      if (value != null) {
        location.reload();
      } else {
        this.checkUsername = false;
      }
    });
  }

  checkRePass() {
    let pass = this.formSignUp.value.pass1;
    let repass = this.formSignUp.value.rePass;
    if (pass != repass) {
      this.checkRepass = false;
    } else {
      this.checkRepass = true;
    }
  }
}
