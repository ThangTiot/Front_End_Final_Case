import {Users} from "./Users";

export interface Posts {
  id?: number;
  content?: string;
  imageName?: string;
  likeCount?: number;
  permissionPost?: string;
  createPost?: Date;
  deletePost?: boolean;
  users?: Users;
}
