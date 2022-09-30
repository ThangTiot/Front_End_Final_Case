import {Component, Inject, OnInit} from '@angular/core';
import {Users} from "../../model/Users";
import {UsersService} from "../../service/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../../service/posts.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";

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
  loading: boolean = true;

  constructor(private userService: UsersService,
              private formBuilder: FormBuilder,
              private postService: PostsService,
              private storage: AngularFireStorage) {
  }

  ngOnInit(): void {
    let id = sessionStorage.getItem("userPresentId");
    if (id) {
      this.userService.findById(parseInt(id)).subscribe(data => {
        this.userPresent = data;
      });
    }
    // this.formCreatePost = this.formBuilder.group({
    //   content: ["",Validators.],
    // })
  }

  showPreview(event: any) {
    this.imageFile = event.target.files[0]
    this.submitImage();
  }

  submitImage() {
    if (this.imageFile != null) {
      const fileName = this.imageFile.name;
      const fileRef = this.storage.ref(fileName);
      this.storage.upload(fileName, this.imageFile).snapshotChanges().pipe(
        finalize(() => (fileRef.getDownloadURL().subscribe(url => {
          this.imageSrc = url;
          this.loading = false;
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
