import { Plugin } from "./plugin";
import {
  getDataFromPaginatedApi,
  getJSON,
  handleServerError,
} from "./plugin.service";
import { Post } from "./types/post.model";
import { Comment } from "./types/comment.model";
const fs = require("fs");

type PostWithComment = Post & Partial<{ comments: Comment[] }>;

export class DummyAPIPlugin extends Plugin {
  constructor(appId: string) {
    super({
      "app-id": appId,
    });
  }

  async checkConnectivity(): Promise<void> {
    return super.checkConnectivity(
      `${process.env.DUMMYAPI_BASE_URL}/user?limit=1`
    );
  }

  public async getUsers(): Promise<void> {
    return getDataFromPaginatedApi(
      process.env.DUMMYAPI_USERS_FILENAME!,
      `${process.env.DUMMYAPI_BASE_URL}/user`,
      this.headers
    );
  }

  public async savePostsWithComments(): Promise<void> {
    try {
      await this.getPostsWithComments().then((postsWithComments) => {
        const stream = fs.createWriteStream(
          process.env.DUMMYAPI_POSTS_WITH_COMMENTS_FILENAME,
          {
            flags: "w",
          }
        );

        stream.write(JSON.stringify(postsWithComments, null, "\t"));

        stream.end();
      });
    } catch (error) {
      handleServerError(error);
    }
  }

  private async getPostsWithComments(): Promise<PostWithComment[]> {
    const postsWithComments: PostWithComment[] = [];
    const posts = await this.getPosts();

    for (const post of posts) {
      const commentsOfPost = await this.getComments(post.id);

      const postWithComment: PostWithComment = {
        ...post,
        comments: commentsOfPost,
      };

      postsWithComments.push(postWithComment);
    }

    return postsWithComments;
  }

  private async getPosts(): Promise<Post[]> {
    return getJSON<Post[]>(
      `${process.env.DUMMYAPI_BASE_URL}/post?limit=50`,
      this.headers
    );
  }

  private async getComments(postId: string): Promise<Comment[]> {
    return getJSON<Comment[]>(
      `${process.env.DUMMYAPI_BASE_URL}/post/${postId}/comment`,
      this.headers
    );
  }
}
