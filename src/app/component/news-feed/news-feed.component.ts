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


@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  userPresent!: User;
  formCreatePost!: FormGroup;
  imageFile!: any;
  imageSrc: any = "";
  disablePost: boolean = false;
  listPostOfNewFeed!: Post[];
  friendList!: User[];
  friendListConfirm!: User[];
  idUserPresent!: any;
  likePostList!: LikePost[];
  allUserNotFriend!: User[];

  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private router: Router,
    private postService: PostsService,
    private userService: UsersService,
    private likePostService: LikePostService,
    private relationshipService: RelationshipService
  ) {
  }

  ngOnInit(): void {
    this.listPostOfNewFeed = [];
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.getUserPresent();
    this.getAllFriend();
    this.getAllPostOfNewFeed();
    this.getAllLikePost();
    this.findAllUserNotFriend();
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
      this.userService.findAllFriendConfirm(this.idUserPresent).subscribe(listFriendConfirm => {
        this.friendListConfirm = listFriendConfirm;
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
        this.getAllPostOfNewFeed()
      }
    );
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

  findAllUserNotFriend(){
    return this.userService.findAllUserNotFriend(this.idUserPresent).subscribe(data=>{this.allUserNotFriend = data})
  }


  addFriend(idUser: any) {
    let relationship = {
      usersTo: {
        id: this.idUserPresent,
      },
      usersFrom: {
        id: idUser,
      }
    }
    this.relationshipService.addFriend(relationship).subscribe(() => {
      this.getAllPostOfNewFeed();
      this.getAllFriend();
    });
  }
}
