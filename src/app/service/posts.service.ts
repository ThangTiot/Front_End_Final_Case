import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../model/Post";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  createPost(post: any): Observable<Post> {
    return this.httpClient.post("http://localhost:8080/posts/create",post)
  }

  findPostOfNewFeed(id: any): Observable<Post[]> {
    return this.httpClient.get<Post[]>("http://localhost:8080/posts/listPostOfNewFeed/" + id)
  }

  deletePost(postId: any): Observable<void>{
    return this.httpClient.delete<void>("http://localhost:8080/post/delete/" + postId)
  }
}
