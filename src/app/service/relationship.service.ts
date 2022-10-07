import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Relationship} from "../model/Relationship";

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
}
