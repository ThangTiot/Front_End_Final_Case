import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../service/users.service";
import Swal from 'sweetalert2'
import {Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  formSignIn!: FormGroup;
  formSignUp!: FormGroup;
  signInError: boolean = false;
  checkUsernameExist: boolean = false;
  checkRepass: boolean = true;
  idUserPresent!: any;
  checkRqUserName: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private userService: UsersService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.idUserPresent = localStorage.getItem("userPresentId");
    if (this.idUserPresent) {
      this.router.navigateByUrl('newsFeed').then(() => location.reload());
    }
    this.formSignIn = this.formBuilder.group(
      {
        id: "",
        userName: ["", Validators.required],
        pass: ["", Validators.required]
      }
    );
    this.formSignUp = this.formBuilder.group(
      {
        userName1: ["", Validators.required],
        pass1: ["", [Validators.pattern(/^(?=.*?[A-Z])[A-Za-z0-9]{6,32}$/), Validators.required]],
        rePass: ["", Validators.required],
        fullName: ["", Validators.required],
        gender: ""
      }
    );
  };


  signIn() {
    let userName = this.formSignIn.value.userName;
    let pass = this.formSignIn.value.pass;
    this.userService.signIn(userName, pass).subscribe({
      next: () => {
        this.router.navigateByUrl('newsFeed').then(() => location.reload());
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
      if (value == null) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Register Success!',
          showConfirmButton: false,
          timer: 1500
        }).then(r => location.reload())
      } else {
        switch (value) {
          case "Username is required":
            this.checkRqUserName = true;
            break;
          case "User already exists":
            this.checkUsernameExist = true;
            break;
        }
      }
    });
  }

  checkRePass() {
    let pass = this.formSignUp.value.pass1;
    let repass = this.formSignUp.value.rePass;
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

  changeUserName() {
    this.checkUsernameExist = false;
  }
}
