import { InputType, Field } from 'type-graphql';
import { Comment, Reply } from '../../entities/comment';
import { ObjectId } from 'mongodb';

@InputType()
export class CommentInput implements Partial<Comment> {
  @Field()
  content: string;

  @Field(type => ObjectId)
  parent: ObjectId
}

@InputType()
export class ReplyInput implements Partial<Reply> {
  @Field()
  content: string;

  @Field(type => ObjectId, { description: "回复的评论id" })
  parent: ObjectId;

  @Field(type => ObjectId, { nullable: true })
  to: ObjectId;
}