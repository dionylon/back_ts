import { Resolver, FieldResolver, Root, Arg, Mutation, Ctx, UseMiddleware, Args, Int } from 'type-graphql';
import { ResourceBaseResolver } from './Resouce';
import { PostModel, Post } from '../entities/post';
import { PostInput, PostUpdateInput } from './input/post.input';
import { User, UserModel } from '../entities/user';
import Context from '../types/Context';
import { AuthAccess } from '../middlewares/auth-access';
import { ObjectId } from 'mongodb';
import { Comment, CommentModel, ReplyModel } from '../entities/comment';


@Resolver(Post)
export class PostResolver extends ResourceBaseResolver(Post, PostModel, PostInput) {
  @FieldResolver(returns => User)
  async author(@Root() root: Post) {
    return UserModel.findById(root.author);
  }
  @FieldResolver(returns => Int)
  async commentsCount(
    @Root() post: Post
  ) {
    const commentCount = await CommentModel.countDocuments({ parent: post._id });
    const replyCount = await ReplyModel.countDocuments({ post: post._id });
    return commentCount + replyCount;
  }

  @Mutation(returns => Post)
  @UseMiddleware(AuthAccess)
  async newPost(
    @Arg("post") postInput: PostInput,
    @Ctx() ctx: Context
  ) {
    // console.log(ctx);
    const post = new PostModel({
      ...postInput,
      author: ctx.user?.id
    })
    const res = await post.save();
    return res;
  }

  @Mutation(returns => Boolean)
  @UseMiddleware(AuthAccess)
  async updatePost(
    @Arg("id") id: ObjectId,
    @Arg("post") post: PostUpdateInput,
    @Ctx() ctx: Context
  ) {
    const newpost = { ...post };
    const res = await PostModel.updateOne(
      { _id: id, author: ctx.user?.id },
      newpost
    );
    return res.ok == 1;
  }

  @Mutation(returns => Boolean, { nullable: true })
  @UseMiddleware(AuthAccess)
  async deletePost(
    @Arg("id") id: ObjectId,
    @Ctx() ctx: Context
  ) {
    const res = await PostModel.deleteOne({ _id: id, author: ctx.user?.id });
    return res.ok == 1;
  }

}