import { Component, OnInit } from '@angular/core';
import {Users} from "../../model/Users";
import {UsersService} from "../../service/users.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  userPresent!: Users;
  formCreatePost!: FormGroup;

  constructor(private userService: UsersService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let id = sessionStorage.getItem("userPresentId");
    if (id) {
      this.userService.findById(parseInt(id)).subscribe(data => {
        this.userPresent = data;
      });
    };
    this.formCreatePost = this.formBuilder.group({
      content: "",
      imageFile: "",
    })
  }

  createPost() {
    // const ref = firebase.storage().ref();
    // const file = document.querySelector('#imagePost').files[0];
    // const metadata = {
    //   contentType: file.type
    // }
    // let image = file.name;
    // const uploadIMG = ref.child(image).put(file, metadata);
    // uploadIMG.then(snapshot => snapshot.ref.getDownloadURL())
    //   .then(url => {
    //     let URl = url;
    //     let posts = {
    //       content: content,
    //       imageName: URl,
    //       permissionPost: permission,
    //       users: {
    //         id: this.userPresent.id,
    //       }
    //     }
    //   });
  }
}
