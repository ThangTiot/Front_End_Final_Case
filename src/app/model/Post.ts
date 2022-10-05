import {User} from "./User";

export interface Post {
  id?: number;
  content?: string;
  imageName?: string;
  likeCount?: number;
  commentCount?: number;
  permissionPost?: string;
  createDate?: Date;
  users?: User;
}
