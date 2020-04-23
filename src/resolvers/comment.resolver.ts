import { Resolver, FieldResolver, Arg, Root, Mutation, Ctx, UseMiddleware, Int } from 'type-graphql';
import { Comment, CommentModel, Reply, ReplyModel } from '../entities/comment';
import { ResourceBaseResolver } from './Resouce';
import { CommentInput, ReplyInput } from './input/comment.input';
import { Post, PostModel } from '../entities/post';
import Context from '../types/Context';
import { AuthAccess } from '../middlewares/auth-access';
import { User, UserModel } from '../entities/user';


@Resolver(Comment)
export class CommentResolver extends ResourceBaseResolver(Comment, CommentModel, CommentInput) {

  @FieldResolver(returns => [Reply], { nullable: true, description: "默认只查3个" })
  async replyList(
    @Root() comment: Comment
  ) {
    return await ReplyModel
      .find({ parent: comment._id })
      .sort({ createAt: 1 })
      .limit(3);
  }

  @FieldResolver(returns => Int, { defaultValue: 0 })
  async replyCount(
    @Root() comment: Comment
  ) {
    return ReplyModel.count({ parent: comment._id });
  }

  @FieldResolver(returns => Post, { nullable: true })
  async parent(
    @Root() comment: Comment
  ) {
    return await PostModel.findById(comment.parent);
  }

  @FieldResolver(returns => User)
  async author(
    @Root() root: Comment
  ) {
    return await UserModel.findById(root.author);
  }

  @Mutation(returns => Comment)
  @UseMiddleware(AuthAccess)
  async newComment(
    @Arg("comment") commentInput: CommentInput,
    @Ctx() ctx: Context
  ) {
    const comment = new CommentModel({
      ...commentInput,
      author: ctx.user?.id
    });
    return await comment.save();
  }
}

@Resolver(Reply)
export class ReplyResolver extends ResourceBaseResolver(Reply, ReplyModel, ReplyInput) {

  @FieldResolver(returns => User)
  async from(
    @Root() root: Reply
  ) {
    return await UserModel.findById(root.from);
  }
  @FieldResolver(returns => User, { nullable: true })
  async to(
    @Root() root: Reply
  ) {
    return await UserModel.findById(root.to);
  }
  @Mutation(returns => Reply)
  @UseMiddleware(AuthAccess)
  async newReply(
    @Arg("reply") replyInput: ReplyInput,
    @Ctx() ctx: Context
  ) {
    const reply = new ReplyModel({
      ...replyInput,
      from: ctx.user?.id
    });
    return await reply.save();
  }
}
