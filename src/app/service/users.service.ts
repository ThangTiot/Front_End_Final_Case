import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {User} from "../model/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
  }

  signIn(userName: String, pass: String): Observable<any> {
    const body = new HttpParams()
      .set('username', userName.toString())
      .set('password', pass.toString());
    return this.httpClient.post("http://localhost:8080/login", body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    });
  }
  signUp(users: User): Observable<User> {
    return this.httpClient.post<User>("http://localhost:8080/signUp",users, { withCredentials: true })
  }
  findById(id: number): Observable<User> {
    return this.httpClient.get("http://localhost:8080/users/" + id, { withCredentials: true })
  }
  findAllFriend(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>("http://localhost:8080/friends/findAllFriendOfUser/" + id, { withCredentials: true })
  }
  findAllFriendConfirmTo(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>("http://localhost:8080/friends/findAllFriendOfUserConfirmTo/" + id, { withCredentials: true })
  }
  findAllFriendConfirmFrom(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>("http://localhost:8080/friends/findAllFriendOfUserConfirmFrom/" + id, { withCredentials: true })
  }
  findAllUserNotFriend(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>("http://localhost:8080/friends/findAllUserNotFriend/" + id, { withCredentials: true })
  }
  updateUser(id: any, user: User): Observable<User> {
    return this.httpClient.put<User>("http://localhost:8080/users/" + id, user, { withCredentials: true })
  }
  updateAvatar(id: any, url: String): Observable<User> {
    return this.httpClient.put<User>("http://localhost:8080/users/avatar/" + id, url, { withCredentials: true })
  }
  getUserInfo(): Observable<User> {
    return this.httpClient.get<User>("http://localhost:8080/users/info/", { withCredentials: true })
  }
}
