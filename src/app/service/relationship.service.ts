import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Relationship} from "../model/Relationship";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class RelationshipService {

  constructor(
    private httpclient: HttpClient
  ) {}

  addFriend(relationship: any): Observable<any> {
    return this.httpclient.post("http://localhost:8080/friends/addFriend", relationship, { withCredentials: true });
  }
  unfriend(idUserFrom: any,idUserTo: any): Observable<any> {
    return this.httpclient.delete(`http://localhost:8080/friends/unfriend/${idUserFrom}/${idUserTo}`, { withCredentials: true });
  }
  confirm(idUserFrom: any,idUserTo: any): Observable<any> {
    return this.httpclient.put(`http://localhost:8080/friends/confirm/${idUserFrom}/${idUserTo}`,null, { withCredentials: true });
  }
  findMutualFriends(idPresent: number, id: number): Observable<User[]> {
    return this.httpclient.get<User[]>(`http://localhost:8080/friends/find-all-mutual-friend/${idPresent}/${id}`, { withCredentials: true })
  }
}
