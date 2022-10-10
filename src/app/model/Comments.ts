import {Post} from "./Post";
import {User} from "./User";

export interface Comments {
  id?: number;
  content?: string;
  likeCount?: number;
  dateCreate?: Date;
  posts?: Post;
  users?: User;
  parentComment?: Comments;
}
