import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {UsersService} from "../../service/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../../service/posts.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";
import {Post} from "../../model/Post";
import Swal from 'sweetalert2'
import {Router} from "@angular/router";
import {LikePost} from "../../model/LikePost";
import {LikePostService} from "../../service/like-post.service";
import {RelationshipService} from "../../service/relationship.service";
import {CommentService} from "../../service/comment.service";
import {Comments} from "../../model/Comments";
import {LikeCommentService} from "../../service/like-comment.service";
import {data} from 'jquery';
import {LikeComment} from "../../model/LikeComment";


@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  userPresent!: User;
  formCreatePost!: FormGroup;
  formComment!: FormGroup;
  imageFile!: any;
  imageSrc: any = "";
  disablePost: boolean = false;
  listPostOfNewFeed!: Post[];
  friendList!: User[];
  friendListConfirmTo!: User[];
  friendListConfirmFrom!: User[];
  idUserPresent!: any;
  likePostList!: LikePost[];
  allUserNotFriend!: User[];
  allComment!: Comments[];
  allCommentChild!: Comments[];
  likeCommentList!: LikeComment[];
  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private router: Router,
    private postService: PostsService,
    private userService: UsersService,
    private likePostService: LikePostService,
    private relationshipService: RelationshipService,
    private commentService: CommentService,
    private likeCommentService: LikeCommentService,
  ) {
  }

  ngOnInit(): void {
    this.formCreatePost = this.formBuilder.group({
      id: [""],
      content: ["", Validators.required],
      permissionPost: [""],
    });
    this.formComment = this.formBuilder.group({
      id: [""],
      comment: [""],
    })
    this.listPostOfNewFeed = [];
    this.idUserPresent = localStorage.getItem("userPresentId");
    this.getUserPresent();
    this.getAllFriend();
    this.getAllPostOfNewFeed();
    this.getAllLikePost();
    this.findAllUserNotFriend();
    this.getAllComment();
    this.getAllCommentChild();
    this.getAllLikeComment();
  }

  getUserPresent() {
    if (this.idUserPresent) {
      this.userService.findById(this.idUserPresent).subscribe(data => {
        this.userPresent = data;
      });
    }
  }

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

  getAllPostOfNewFeed() {
    this.postService.findPostOfNewFeed(this.idUserPresent).subscribe(data => {
      this.listPostOfNewFeed = data.reverse();
    });
  }

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
        this.getAllPostOfNewFeed();
      });
    } else {
      this.postService.updatePost(idPost, post).subscribe(() => {
        this.formCreatePost.reset();
        this.imageSrc = "";
        this.getAllPostOfNewFeed();
        document.getElementById("postButton")!.innerText = "Post";
        document.getElementById("postFormTitle")!.innerText = "Create Post";
      });
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
  logout() {
    Swal.fire({
      title: 'Log Out',
      text: "Are you sure?",
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
        this.getAllPostOfNewFeed()
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
      this.getAllPostOfNewFeed();
      this.getAllComment();
      this.getAllCommentChild();
    })
  }

  disLikePost(idPost: any) {
    for (let i = 0; i < this.likePostList.length; i++) {
      if ((this.likePostList[i].post!.id == idPost) && (this.likePostList[i].users!.id == this.idUserPresent)) {
        this.likePostService.disLikePost(this.likePostList[i].id).subscribe(() => {
            this.getAllLikePost();
            this.getAllPostOfNewFeed()
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
          this.getAllPostOfNewFeed();
          this.getAllComment();
          this.getAllCommentChild();
        })
      }
    }
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
          this.getAllPostOfNewFeed()
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
  checkFriend(idUserPost: any) {
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].id == idUserPost) {
        return true;
      }
    }
    return false;
  }

  findAllUserNotFriend() {
    return this.userService.findAllUserNotFriend(this.idUserPresent).subscribe(data => {
      this.allUserNotFriend = data
    })
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
      this.getAllFriend();
      this.findAllUserNotFriend();
      this.getAllPostOfNewFeed();
    });
  }

  createComment(idPost: any,evt: Event) {
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
        this.getAllPostOfNewFeed();
        this.formComment.reset();
      });
    }
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
       this.getAllPostOfNewFeed();
       this.getAllCommentChild();
     })
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
          this.getAllPostOfNewFeed();
          this.getAllCommentChild();
        });
      }
    })
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
        this.getAllPostOfNewFeed();
      });
    } else {
      this.hideReply(idCmtParent);
    }
  }

  getPostValue() {
    document.getElementById("postValue")!.contentEditable = "false";
  }

  getLink(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData!.getData('text/plain');
    if (this.checkLinkPaste(pastedText)) {
      let postContent = document.getElementById("postContent")!.textContent;
      postContent += `<a href="${pastedText}" style="color: #00bff3">${pastedText}</a>`;
      // @ts-ignore
      document.getElementById("postContent").innerHTML = postContent;
      this.imageSrc = pastedText;
    }
  }

  checkLinkPaste(link: string) {
    return link.match("http(s)?:\/\/");
  }

  deleteRequest(idUser: any) {
    this.relationshipService.unfriend(this.idUserPresent, idUser).subscribe(() => {
      this.getAllPostOfNewFeed();
      this.getAllFriend();
      this.findAllUserNotFriend();
    });
  }

  confirm(idUser: any) {
    this.relationshipService.confirm(this.idUserPresent, idUser).subscribe(() => {
      this.getAllPostOfNewFeed();
      this.getAllFriend();
      this.findAllUserNotFriend();
    });
  }
}


