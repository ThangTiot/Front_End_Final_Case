import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Posts} from "../model/Posts";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  createPost(post: any): Observable<Posts> {
    return this.httpClient.post("http://localhost:8080/post/create",post)
  }

  findAllPost(): Observable<Posts[]> {
    return this.httpClient.get<Posts[]>("http://localhost:8080/post/findAll")
  }
}
