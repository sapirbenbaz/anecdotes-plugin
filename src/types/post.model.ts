import { User } from "./user.model";

export interface Post {
  id: string;
  text: string;
  image: string;
  likes: number;
  tags: [string];
  publishDate: string;
  owner: User;
}
