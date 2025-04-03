import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  loginWithGoogle(){
    window.location.href = environment.googleAuthUrl;
  }

  getUser() {
    return this.http.get(`${environment.apiUrl}/user`)
  }
}
