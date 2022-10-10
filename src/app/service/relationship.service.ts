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

  addFriend(relationship: any): Observable<Relationship> {
    return this.httpclient.post("http://localhost:8080/friends/addFriend", relationship);
  }
  findMutualFriends(idPresent: number, id: number): Observable<User[]> {
    return this.httpclient.get<User[]>("http://localhost:8080/friends/" + idPresent +"/"+ id)
  }
}
