import {Component, Inject, OnInit} from '@angular/core';
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


@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  userPresent!: User;
  formCreatePost!: FormGroup;
  imageFile!: any;
  imageSrc: string = "";
  loadingImgPost: boolean = false;
  disablePost: boolean = false;
  listPostOfNewFeed!: Post[];
  friendList!: User[];
  friendListConfirm!: User[];
  idUserPresent!: any;
  likePostList!: LikePost[];

  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private router: Router,
    private postService: PostsService,
    private userService: UsersService,
    private likePostService: LikePostService) {}

  ngOnInit(): void {
    this.listPostOfNewFeed = [];
    this.idUserPresent = sessionStorage.getItem("userPresentId");
    this.getUserPresent();
    this.getAllFriend();
    this.getAllPostOfNewFeed();
  }

  getUserPresent() {
    if (this.idUserPresent) {
      this.userService.findById(this.idUserPresent).subscribe(data => {
        this.userPresent = data;
      });
    }
    this.formCreatePost = this.formBuilder.group({
      content: ["", Validators.required]
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
      console.log(data);
    });
  }

  getAllLikePost() {
    this.likePostService.findAll().subscribe(data => {
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
              this.loadingImgPost = true;
              this.disablePost = false;
              Swal.close();
            })))
          ).subscribe();
        }
      }).then();
    }
  }

  createPost() {
    let post = {
      content: this.formCreatePost.value.content,
      imageName: this.imageSrc,
      // @ts-ignore
      permissionPost: document.getElementById("permissionPost").value,
      users: this.userPresent,
    }
    this.postService.createPost(post).subscribe(() => {
        this.loadingImgPost = false;
        this.imageSrc = "";
        this.formCreatePost.reset();
        this.ngOnInit();
      }
    );
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
  deletePost(id: number){
    if (confirm("Do you want to remove this post")){
      this.postService.deletePost(id).subscribe(() => {
        alert("Delete success")
      });
    } else {
      alert("Delete Fail")
    }
  }
}
