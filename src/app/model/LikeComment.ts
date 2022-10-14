import {User} from "./User";
import {Comments} from "./Comments";
export interface LikeComment {
  id?: number;
  users?: User;
  comments?: Comments;
}
