import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
  }

  signIn(users: User): Observable<User> {
    return this.httpClient.post<User>("http://localhost:8080/logIn/logIn",users)
  }
  signUp(users: User): Observable<User> {
    return this.httpClient.post<User>("http://localhost:8080/logIn/signUp",users)
  }

  findById(id: number): Observable<User> {
    return this.httpClient.get("http://localhost:8080/users/" + id)
  }
  findAllFriend(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>("http://localhost:8080/friends/findAllFriendOfUser/" + id)
  }
  findAllFriendConfirm(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>("http://localhost:8080/friends/findAllFriendOfUserConfirm/" + id)
  }
}
