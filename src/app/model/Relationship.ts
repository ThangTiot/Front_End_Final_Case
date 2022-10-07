import {User} from "./User";

export interface Relationship {
  id?: number;
  usersTo?: User;
  usersFrom?: User;
}
