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
  imageFile!: any;
  imageSrc: any = "";
  disablePost: boolean = false;
  listPostOfNewFeed!: Post[];
  friendList!: User[];
  friendListConfirmTo!: User[];
  friendListConfirmFrom!: User[];
  idUserPresent!: any;
  likePostList!: LikePost[];
  constructor(private timelineService: TimelineService,
              private routerActive: ActivatedRoute,
              private formBuilder: FormBuilder,
              private storage: AngularFireStorage,
              private router: Router,
              private postService: PostsService,
              private userService: UsersService,
              private likePostService: LikePostService,
              private relationshipService: RelationshipService
  ) { }

  ngOnInit(): void {
    this.routerActive.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.userService.findById(this.id).subscribe((data)=>{
        this.user = data
      })
      this.getAllPostOfUser()
    })
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.getUserPresent();
    this.getAllFriend();
    this.getAllLikePost();
  }
  getAllPostOfUser(){
    this.timelineService.findAllById(this.id).subscribe((data1)=>{
      this.posts = data1.reverse()
    })
  }
  getUserPresent() {
    if (this.idUserPresent) {
      this.userService.findById(this.idUserPresent).subscribe(data => {
        this.userPresent = data;
      });
    }
    this.formCreatePost = this.formBuilder.group({
      id: [""],
      content: ["", Validators.required],
      permissionPost: [""],
    })
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
        this.router.navigateByUrl('').then(() => location.reload());
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

  checkFriend(): string {
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
      this.checkFriend();
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
          this.checkFriend();
          this.getAllPostOfUser();
          this.getAllFriend();
        });
      }
    })
  }

  deleteRequest() {
    this.relationshipService.unfriend(this.idUserPresent, this.id).subscribe(() => {
      this.checkFriend();
      this.getAllPostOfUser();
      this.getAllFriend();
    });
  }

  confirm(idUser: any) {
    this.relationshipService.confirm(this.idUserPresent, idUser).subscribe(() => {
      this.checkFriend();
      this.getAllPostOfUser();
      this.getAllFriend();
    });
  }
}
