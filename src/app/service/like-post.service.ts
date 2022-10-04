import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LikePost} from "../model/LikePost";

@Injectable({
  providedIn: 'root'
})
export class LikePostService {

  constructor(private httpClient: HttpClient) {

  }

  findAll(): Observable<LikePost[]> {
    return this.httpClient.get<LikePost[]>('http://localhost:8080/likePost/findAll')
  }

  likePost(likePost: LikePost): Observable<LikePost> {
    return this.httpClient.post('http://localhost:8080/likePost/like',likePost)
  }

  disLikePost(id: number): Observable<void> {
    return this.httpClient.delete<void>('http://localhost:8080/likePost/' + id);
  }
}
