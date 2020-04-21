import { Resolver, FieldResolver, Arg, Root, Mutation, Ctx, UseMiddleware } from 'type-graphql';
import { Comment, CommentModel } from '../entities/comment';
import { ResourceBaseResolver } from './Resouce';
import { CommentInput } from './input/comment.input';
import { Post, PostModel } from '../entities/post';
import Context from '../types/Context';
import { AuthAccess } from '../middlewares/auth-access';
import { User, UserModel } from '../entities/user';


@Resolver(Comment)
export class CommentResolver extends ResourceBaseResolver(Comment, CommentModel, CommentInput) {

  @FieldResolver(returns => Post, { nullable: true })
  async replyOf(
    @Root() root: Comment
  ) {
    return await PostModel.findById(root.replyOf);
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
    const date = new Date();
    const comment = new CommentModel({
      ...commentInput,
      createBy: date,
      author: ctx.user?.id
    });
    return await comment.save();
  }
}