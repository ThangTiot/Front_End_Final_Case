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
  nrSelect = 1;
  nrSelectMonth = 1;
  nrSelectYear = 1900;
  userPresent!: User;
  dayOfForm: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  monthOfForm: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearOfForm: number[] = [1900,
    1901,
    1902,
    1903,
    1904,
    1905,
    1906,
    1907,
    1908,
    1909,
    1910,
    1911,
    1912,
    1913,
    1914,
    1915,
    1916,
    1917,
    1918,
    1919,
    1920,
    1921,
    1922,
    1923,
    1924,
    1925,
    1926,
    1927,
    1928,
    1929,
    1930,
    1931,
    1932,
    1933,
    1934,
    1935,
    1936,
    1937,
    1938,
    1939,
    1940,
    1941,
    1942,
    1943,
    1944,
    1945,
    1946,
    1947,
    1948,
    1949,
    1950,
    1951,
    1952,
    1953,
    1954,
    1955,
    1956,
    1957,
    1958,
    1959,
    1960,
    1961,
    1962,
    1963,
    1964,
    1965,
    1966,
    1967,
    1968,
    1969,
    1970,
    1971,
    1972,
    1973,
    1974,
    1975,
    1976,
    1977,
    1978,
    1979,
    1980,
    1981,
    1982,
    1983,
    1984,
    1985,
    1986,
    1987,
    1988,
    1989,
    1990,
    1991,
    1992,
    1993,
    1994,
    1995,
    1996,
    1997,
    1998,
    1999,
    2000,
    2001,
    2002,
    2003,
    2004,
    2005,
    2006,
    2007,
    2008,
    2009,
    2010,
    2011,
    2012,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022];
  formUserInfo!: FormGroup;
  formUserPass!: FormGroup;
  idUserPresent!: any;
  dateOfBirth!: Date;

  constructor(private formBuilder: FormBuilder,
              private storage: AngularFireStorage,
              private userService: UsersService,
              private router: Router) {

  }


  ngOnInit(): void {
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.getUserPresent();
  }

  getUserPresent() {
    this.formUserInfo = this.formBuilder.group({
        fullName: ["",[Validators.required,Validators.pattern(/^[A-Z][a-zA-Z]+$ / )]],
        phone: ["",[Validators.pattern(/^[0-9]+(?!.)/ ),Validators.max(10),Validators.required,]
          ],
        gender: [""],
        email: [""],
        address: [""],
        hobby: [""],
        day: [""],
      month : [""],
      year : [""]
      }
    )
    this.formUserPass = this.formBuilder.group({
      pass: [""],
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
    // this.dateOfBirth.setDate(this.formUserInfo.value.day);
    // this.dateOfBirth.setMonth(this.formUserInfo.value.month);
    // this.dateOfBirth.setFullYear(this.formUserInfo.value.year);

    let user = {
      fullName: this.formUserInfo.value.fullName,
      phone: this.formUserInfo.value.phone,
      gender: this.formUserInfo.value.gender,
      email: this.formUserInfo.value.email,
      address: this.formUserInfo.value.address,
      hobby: this.formUserInfo.value.hobby,
      day: this.dateOfBirth
    }
    this.userService.updateUser(this.idUserPresent, user).subscribe(() => {
      location.reload()
    })

  }

  updateUserPass() {
    let user = {
      pass: this.formUserPass.value.pass
    }
    this.userService.updateUser(this.idUserPresent, user).subscribe(() => {
      location.reload()
    })
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



}
