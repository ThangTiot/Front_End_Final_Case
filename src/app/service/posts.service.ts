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

  findById(id: any): Observable<Post> {
    return this.httpClient.get("http://localhost:8080/posts/findById/" + id);
  }

  deletePost(id: any): Observable<any> {
    return this.httpClient.delete("http://localhost:8080/posts/delete/" + id)
  }

  updatePost(id: any, post: Post): Observable<Post> {
    return this.httpClient.put<Post>("http://localhost:8080/posts/update/" + id, post)
  }
}
