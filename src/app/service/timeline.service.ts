import { Injectable } from '@angular/core';
import firebase from "firebase/compat";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/Post";

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  post: Post[] =[]
  constructor(private http:HttpClient) { }
  savePost(post: any): Observable<Post> {
    return this.http.post<Post>("http://localhost:8080/create" , post);
  }
  editPost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`http://localhost:8080/update${id}`, post);
  }
  findAllById(id: number): Observable<Post[]> {
    return this.http.get<Post[]>(`http://localhost:8080/posts/findPostById/${id}`);
  }
  deletePost(id?: number): Observable<Post> {
    return this.http.delete<Post>(`http://localhost:8080/delete/${id}`);
  }
}
