import { Component, OnInit } from '@angular/core';
import {User} from "../../model/User";
import {TimelineService} from "../../service/timeline.service";
import {UsersService} from "../../service/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LikePost} from "../../model/LikePost";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {PostsService} from "../../service/posts.service";
import {LikePostService} from "../../service/like-post.service";
import Swal from "sweetalert2";
import {finalize} from "rxjs";
import {Post} from "../../model/Post";
import {RelationshipService} from "../../service/relationship.service";
import {Comments} from "../../model/Comments";
import {CommentService} from "../../service/comment.service";
import {LikeComment} from "../../model/LikeComment";
import {LikeCommentService} from "../../service/like-comment.service";

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent implements OnInit {
  id: any;
  timeline: any;
  user!: User;
  posts! : Post[];
  userPresent!: User;
  formCreatePost!: FormGroup;
  formComment!: FormGroup;
  imageFile!: any;
  imageSrc: any = "";
  disablePost: boolean = false;
  friendList!: User[];
  friendListConfirmTo!: User[];
  friendListConfirmFrom!: User[];
  idUserPresent!: any;
  likePostList!: LikePost[];
  allComment!: Comments[];
  allCommentChild!: Comments[];
  likeCommentList!: LikeComment[];

  constructor(private timelineService: TimelineService,
              private routerActive: ActivatedRoute,
              private formBuilder: FormBuilder,
              private storage: AngularFireStorage,
              private router: Router,
              private postService: PostsService,
              private userService: UsersService,
              private likePostService: LikePostService,
              private relationshipService: RelationshipService,
              private commentService: CommentService,
              private likeCommentService: LikeCommentService,
  ) { }

  ngOnInit(): void {
    this.formCreatePost = this.formBuilder.group({
      id: [""],
      content: ["", Validators.required],
      permissionPost: [""],
    });
    this.formComment = this.formBuilder.group({
      id: [""],
      comment: [""],
    });
    this.getUserPresent();
    this.getAllFriend();
    this.getAllLikePost();
    this.getAllComment();
    this.getAllLikeComment();
    this.getAllCommentChild();
  }
  getAllPostOfUser(){
    if (this.idUserPresent == this.id) {
      this.timelineService.findAllById(this.id).subscribe((data1) => {
        this.posts = data1.reverse()
      });
    } else {
      this.timelineService.findPostOfTimeLine(this.id, this.idUserPresent).subscribe(data => {
        this.posts = data.reverse();
      });
    }
  }
  getUserPresent() {
    this.idUserPresent = localStorage.getItem("userPresentId");
    this.routerActive.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.userService.findById(this.id).subscribe((data)=>{
        this.user = data
      })
      this.getAllPostOfUser()
    });
    if (this.idUserPresent) {
      this.userService.findById(this.idUserPresent).subscribe(data => {
        this.userPresent = data;
      });
    }

  }

  // Danh sách bạn của user đang đăng nhập
  getAllFriend() {
    if (this.idUserPresent) {
      this.userService.findAllFriend(this.idUserPresent).subscribe(listFriend => {
        this.friendList = listFriend;
      });
      this.userService.findAllFriendConfirmTo(this.idUserPresent).subscribe(listFriendConfirmTo => {
        this.friendListConfirmTo = listFriendConfirmTo;
      });
      this.userService.findAllFriendConfirmFrom(this.idUserPresent).subscribe(listFriendConfirmFrom => {
        this.friendListConfirmFrom = listFriendConfirmFrom;
      });
    }
  };

  getAllLikePost() {
    this.likePostService.findAllByUser(this.idUserPresent).subscribe(data => {
      this.likePostList = data;
    });
  }
  getAllLikeComment() {
    this.likeCommentService.findAllByUser(this.idUserPresent).subscribe(data => {
      this.likeCommentList = data
    })
  }
  getAllComment() {
    this.commentService.findAll().subscribe(data => {
      this.allComment = data;
    });
  }
  getAllCommentChild() {
    this.commentService.findAllCommentChild().subscribe(data => {
      this.allCommentChild = data;
    });
  }

  getCommentByPost(idPost: any){
    let commentOfPost: Comments[] = [];
    for (let i = 0; i < this.allComment.length; i++) {
      if (this.allComment[i].posts!.id == idPost) {
        commentOfPost.push(this.allComment[i]);
      }
    }
    return commentOfPost;
  }

  getCommentChildByComment(idCmt: any){
    let commentChild: Comments[] = [];
    for (let i = 0; i < this.allCommentChild.length; i++) {
      if (this.allCommentChild[i].idParentComment == idCmt) {
        commentChild.push(this.allCommentChild[i]);
      }
    }
    return commentChild;
  }

  showPreview(event: any) {
    this.imageFile = event.target.files[0]
    this.disablePost = true;
    this.submitImage();
  }

  submitImage() {
    if (this.imageFile != null) {
      const fileName = this.imageFile.name;
      const fileRef = this.storage.ref(fileName);
      // @ts-ignore
      Swal.fire({
        title: 'Loading...',
        html: 'Please wait...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.storage.upload(fileName, this.imageFile).snapshotChanges().pipe(
            finalize(() => (fileRef.getDownloadURL().subscribe(url => {
              this.imageSrc = url;
              this.disablePost = false;
              Swal.close();
            })))
          ).subscribe();
        }
      }).then();
    }
  }
  createPost() {
    let idPost = this.formCreatePost.value.id;
    let post = {
      content: this.formCreatePost.value.content,
      // @ts-ignore
      permissionPost: document.getElementById("permissionPost").value,
      imageName: this.imageSrc,
      users: {
        id: this.idUserPresent,
      },
    }
    if (idPost == "" || idPost == null) {
      this.postService.createPost(post).subscribe(() => {
        this.formCreatePost.reset();
        this.imageSrc = "";
        this.getAllPostOfUser();
      });
    } else {
      this.postService.updatePost(idPost, post).subscribe(() => {
        this.formCreatePost.reset();
        this.imageSrc = "";
        this.getAllPostOfUser();
        document.getElementById("postButton")!.innerText = "Post";
        document.getElementById("postFormTitle")!.innerText = "Create Post";
      });
    }
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('').then(() => {
          localStorage.clear();
          location.reload()
        });
      }
    })
  }
  likeShow(post: Post) {
    for (let i = 0; i < this.likePostList.length; i++) {
      if ((this.likePostList[i].post!.id == post.id) && (this.likePostList[i].users!.id == this.idUserPresent)) {
        return true;
      }
    }
    return false;
  }
  likeShowComment(cmt: Comments) {
    for (let i = 0; i < this.likeCommentList.length; i++) {
      if (this.likeCommentList[i].comments!.id == cmt.id) {
        return true;
      }
    }
    return false;
  }
  likePost(idPost: any) {
    let likePost = {
      users: {
        id: this.idUserPresent,
      },
      post: {
        id: idPost,
      }
    }
    this.likePostService.likePost(likePost).subscribe(() => {
        this.getAllLikePost();
        this.getAllPostOfUser()
      }
    );
  }
  likeComment(idComment: any) {
    let likeComment = {
      users: {
        id: this.idUserPresent,
      },
      comments: {
        id: idComment,
      }
    }
    this.likeCommentService.likeComment(likeComment).subscribe(() => {
      this.getAllLikeComment();
      this.getAllPostOfUser();
      this.getAllComment();
      this.getAllCommentChild();
    })
  }
  disLikePost(idPost: any) {
    for (let i = 0; i < this.likePostList.length; i++) {
      if ((this.likePostList[i].post!.id == idPost) && (this.likePostList[i].users!.id == this.idUserPresent)) {
        this.likePostService.disLikePost(this.likePostList[i].id).subscribe(() => {
            this.getAllLikePost();
            this.getAllPostOfUser()
          }
        );
      }
    }
  }
  disLikeComment(idComment:any){
    for (let i = 0 ; i < this.likeCommentList.length; i++){
      if (this.likeCommentList[i].comments!.id == idComment) {
        this.likeCommentService.disLikeComment(this.likeCommentList[i].id).subscribe(()=>{
          this.getAllLikeComment();
          this.getAllPostOfUser();
          this.getAllComment();
          this.getAllCommentChild();
        })
      }
    }
  }
  updatePostForm(idPost: any) {
    this.formCreatePost.reset();
    this.imageSrc = "";
    this.postService.findById(idPost).subscribe(data => {
      this.formCreatePost.patchValue(data);
      if (data.imageName != "") {
        this.imageSrc = data.imageName;
      }
      document.getElementById("postButton")!.innerText = "Update";
      document.getElementById("postFormTitle")!.innerText = "Update Post";
      // @ts-ignore
      document.getElementById("permissionPost").value = data.permissionPost;
    });
  }
  deletePost(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(id).subscribe(() =>
          this.getAllPostOfUser()
        );
      }
    })
  }
  clearFormCreatePost() {
    this.formCreatePost.reset();
    this.imageSrc = "";
    document.getElementById("postButton")!.innerText = "Post";
    document.getElementById("postFormTitle")!.innerText = "Create Post";
  }
  deleteImage() {
    this.imageSrc = "";
  }

  // Kiểm tra mỗi quan hệ với dựa trên danh sách bạn của user đang đăng nhập
  checkRelationShip(): string {
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].id == this.user.id) {
        return "friend";
      }
    }
    for (let i = 0; i < this.friendListConfirmTo.length; i++) {
      if (this.friendListConfirmTo[i].id == this.user.id) {
        return "cancel request";
      }
    }
    for (let i = 0; i < this.friendListConfirmFrom.length; i++) {
      if (this.friendListConfirmFrom[i].id == this.user.id) {
        return "confirm";
      }
    }
    return "strange";
  }

  checkFriend() {
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].id == this.id) {
        return true;
      }
    }
    return false;
  }

  addFriend(idUser: any) {
    let relationship = {
      usersFrom: {
        id: this.idUserPresent,
      },
      usersTo: {
        id: idUser,
      }
    }
    this.relationshipService.addFriend(relationship).subscribe(() => {
      this.checkRelationShip();
      this.getAllPostOfUser();
      this.getAllFriend();
    });
  }

  unfriend(idUser: any) {
    Swal.fire({
      title: 'Unfriend ' + this.user.fullName,
      text: "Are you sure want to unfriend " + this.user.fullName + "?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.relationshipService.unfriend(this.idUserPresent, idUser).subscribe(() => {
          this.checkRelationShip();
          this.getAllPostOfUser();
          this.getAllFriend();
        });
      }
    })
  }

  deleteRequest(idUser: any) {
    this.relationshipService.unfriend(this.idUserPresent, idUser).subscribe(() => {
      this.checkRelationShip();
      this.getAllPostOfUser();
      this.getAllFriend();
    });
  }

  confirm(idUser: any) {
    this.relationshipService.confirm(this.idUserPresent, idUser).subscribe(() => {
      this.checkRelationShip();
      this.getAllPostOfUser();
      this.getAllFriend();
    });
  }

  createComment(idPost: any, evt: any) {
    evt.preventDefault();
    let commentValue = this.formComment.value.comment;
    if (commentValue != null) {
      let comment = {
        content: commentValue,
        posts: {
          id: idPost,
        },
        users: {
          id: this.idUserPresent,
        }
      };
      this.commentService.create(comment).subscribe(() => {
        this.getAllComment();
        this.getAllPostOfUser();
        this.formComment.reset();
      });
    }
  }

  deleteComment(idCmt: any) {
    Swal.fire({
      title: 'Delete Comment ',
      text: "Are you sure want to delete comment?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.delete(idCmt).subscribe(() => {
          this.getAllComment();
          this.getAllPostOfUser();
          this.getAllCommentChild();
        });
      }
    })
  }
  showUpdateCommentForm (cmt : any){

    // @ts-ignore
    document.getElementById(`contentCmt${cmt.id}`).value= cmt.content
    // @ts-ignore
    document.getElementById(`cmt${cmt.id}`).style.display="block"

    // @ts-ignore
    document.getElementById(`cmtContent${cmt.id}`).style.display="none"


  }
  hideUpdateCommentForm (idCmt:any){
    // @ts-ignore
    document.getElementById(`cmt${idCmt}`).style.display="none"

    // @ts-ignore
    document.getElementById(`cmtContent${idCmt}`).style.display="block"

  }
  hideReply (idCmt:any){
    // @ts-ignore
    document.getElementById(`reply${idCmt}`).style.display="none"
  }
  updateComment (idCmt : any, evt: Event) {
    // this.hideUpdateCommentForm(idCmt);
    // @ts-ignore
    let content = document.getElementById(`contentCmt${idCmt}`).value;
    evt.preventDefault();
    if (content == "") {
      this.deleteComment(idCmt)
    } else {
      let comment = {
        content: content
      };
      this.commentService.update(idCmt, comment).subscribe(() => {
        this.getAllComment();
        this.getAllPostOfUser();
        this.getAllCommentChild();
      })
    }
  }
  showReplyCmt(idCmtParent: any) {
    // @ts-ignore
    document.getElementById(`reply${idCmtParent}`).style.display = "block";
  }

  createCommentChild(idPost: any, idCmtParent: any, event: any) {
    event.preventDefault();
    // @ts-ignore
    document.getElementById(`reply${idCmtParent}`).style.display = "none";
    // @ts-ignore
    let commentChildValue = document.getElementById(`childCmtContent${idCmtParent}`).value;
    if (commentChildValue != "") {
      let comment = {
        content: commentChildValue,
        posts: {
          id: idPost,
        },
        idParentComment: idCmtParent,
        users: {
          id: this.idUserPresent,
        }
      };
      this.commentService.create(comment).subscribe(() => {
        this.getAllCommentChild();
        this.getAllPostOfUser();
      });
    } else {
      this.hideReply(idCmtParent);
    }
  }
}
