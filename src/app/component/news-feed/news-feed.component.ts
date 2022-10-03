import {Component, Inject, OnInit} from '@angular/core';
import {Users} from "../../model/Users";
import {UsersService} from "../../service/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../../service/posts.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";
import {Posts} from "../../model/Posts";

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  userPresent!: Users;
  formCreatePost!: FormGroup;
  imageFile!: any;
  imageSrc: string = "";
  loading: boolean = false;
  disablePost: boolean = false;
  allPost!: Posts[];
  listPostOfNewFeed!: Posts[];
  friendList!: Users[];
  friendListConfirm!: Users[];
  idUserPresent!: any;

  constructor(private userService: UsersService,
              private formBuilder: FormBuilder,
              private postService: PostsService,
              private storage: AngularFireStorage) {
  }

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
      this.listPostOfNewFeed = data;
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
      this.storage.upload(fileName, this.imageFile).snapshotChanges().pipe(
        finalize(() => (fileRef.getDownloadURL().subscribe(url => {
          this.imageSrc = url;
          this.loading = true;
          this.disablePost = false;
        })))
      ).subscribe();
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
        this.loading = true;
        this.imageSrc = "";
        this.formCreatePost.reset();
      }
    );
  }
}
