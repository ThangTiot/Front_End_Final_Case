import {User} from "./User";
import {Post} from "./Post";

export interface LikePost {
  id?: number;
  users?: User;
  post?: Post;
}
