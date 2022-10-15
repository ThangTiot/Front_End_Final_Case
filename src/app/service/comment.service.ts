import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Comments} from "../model/Comments";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Comments[]> {
    return this.httpClient.get<Comments[]>("http://localhost:8080/comments/findAllCommentParent");
  }
  public findAllCommentChild(): Observable<Comments[]> {
    return this.httpClient.get<Comments[]>("http://localhost:8080/comments/findAllCommentChild");
  }

  public create(comment: any): Observable<Comments> {
    return this.httpClient.post<Comments>("http://localhost:8080/comments/create", comment);
  }
  public delete(idCmt: any): Observable<any> {
    return this.httpClient.delete("http://localhost:8080/comments/delete/" + idCmt);
  }
 public update(idCmt:any,comment :Comments) : Observable<Comments>{
    return this.httpClient.put<Comments>("http://localhost:8080/comments/update/"+ idCmt,comment);
 }
}
