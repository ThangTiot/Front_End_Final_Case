import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LikeComment} from "../model/LikeComment";

@Injectable({
  providedIn: 'root'
})
export class LikeCommentService {

  constructor(private httpClient: HttpClient) { }
  findAllByUser(idUser: any): Observable<LikeComment[]> {
    return this.httpClient.get<LikeComment[]>('http://localhost:8080/like-comment/findAllByUser/' + idUser)
  }
  likeComment(likeComment: LikeComment): Observable<LikeComment> {
    return this.httpClient.post('http://localhost:8080/like-comment/like',likeComment)
  }
  disLikeComment(id: any): Observable<void> {
    return this.httpClient.delete<void>('http://localhost:8080/like-comment/disLike/' + id);
  }
}
