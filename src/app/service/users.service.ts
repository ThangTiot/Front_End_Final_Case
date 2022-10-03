import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Users} from "../model/Users";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
  }

  signIn(users: Users): Observable<Users> {
    return this.httpClient.post<Users>("http://localhost:8080/logIn/logIn",users)
  }
  signUp(users: Users): Observable<Users> {
    return this.httpClient.post<Users>("http://localhost:8080/logIn/signUp",users)
  }

  findById(id: number): Observable<Users> {
    return this.httpClient.get("http://localhost:8080/user/" + id)
  }
  findAllFriend(id: number): Observable<Users[]> {
    return this.httpClient.get<Users[]>("http://localhost:8080/friend/findAllFriendOfUser/" + id)
  }
  findAllFriendConfirm(id: number): Observable<Users[]> {
    return this.httpClient.get<Users[]>("http://localhost:8080/friend/findAllFriendOfUserConfirm/" + id)
  }
}
