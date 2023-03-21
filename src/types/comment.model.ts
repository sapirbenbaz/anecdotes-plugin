import { User } from "./user.model";

export interface Comment {
  id: string;
  message: string;
  owner: User;
  post: string;
  publishDate: string;
}
