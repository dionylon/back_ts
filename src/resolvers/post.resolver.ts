import { Resolver, FieldResolver, Root, Arg, Mutation, Ctx, UseMiddleware, Args } from 'type-graphql';
import { ResourceBaseResolver } from './Resouce';
import { PostModel, Post } from '../entities/post';
import { PostInput, PostUpdateInput } from './input/post.input';
import { User, UserModel } from '../entities/user';
import Context from '../types/Context';
import { AuthAccess } from '../middlewares/auth-access';
import { ObjectId } from 'mongodb';
import { Comment, CommentModel } from '../entities/comment';


@Resolver(Post)
export class PostResolver extends ResourceBaseResolver(Post, PostModel, PostInput) {
  @FieldResolver(returns => User)
  async author(@Root() root: Post) {
    return UserModel.findOne({ _id: root.author });
  }


  @FieldResolver(returns => [Comment], { nullable: true })
  async comments(@Root() root: Post) {
    return await CommentModel.find({ replyOf: root._id })
  }

  @Mutation(returns => Post)
  @UseMiddleware(AuthAccess)
  async newPost(
    @Arg("post") postInput: PostInput,
    @Ctx() ctx: Context
  ) {
    // console.log(ctx);
    const date = new Date();
    const post = new PostModel({
      ...postInput,
      createBy: date,
      updateBy: date,
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
    const newpost = { ...post, updateBy: new Date() };
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