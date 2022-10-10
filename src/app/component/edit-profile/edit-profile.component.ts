import {Component, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {User} from "../../model/User";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {UsersService} from "../../service/users.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {user} from "@angular/fire/auth";
import {get} from "@angular/fire/database";


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


  constructor(private formBuilder: FormBuilder,
              private storage: AngularFireStorage,
              private userService: UsersService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.getUserPresent();
    const script=document.createElement("script")
    script.innerHTML='document.getElementById("userDate").value='+'"'+'2002-04-09'+'"'
    document.body.append(script);
  }
  dateSelected : any
  fetchDateSelected (){
    console.log("date selected is : "+ this.dateSelected);
  }
  getUserPresent() {
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
    )
    this.formUserPass = this.formBuilder.group({
      pass1: [""],
      rePass: [""],
      currentPass: [""]
    })
    if (this.idUserPresent) {
      this.userService.findById(this.idUserPresent).subscribe(data => {
        this.userPresent = data;
        this.formUserInfo.patchValue(data)
      });
    }
  }
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
       this.userService.updateUser(this.idUserPresent,user).subscribe(() => {})
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
    document.getElementById("user-info").style.display = "block"
    // @ts-ignore
    document.getElementById("user-pass").style.display = "none"
    // @ts-ignore

  }

  showPassForm() {

// @ts-ignore
    document.getElementById("user-info").style.display = "none"
    // @ts-ignore
    document.getElementById("user-pass").style.display = "block"

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
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


}
