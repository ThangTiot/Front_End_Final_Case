import {Post} from "./Post";
import firebase from "firebase/compat";
import User = firebase.User;

export interface Comment {
  id?: number;
  content?: string;
  likeCount?: number;
  dateCreate?: Date;
  posts?: Post;
  users?: User;
  parentComment?: Comment;
}
