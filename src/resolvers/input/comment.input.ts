import { InputType, Field } from 'type-graphql';
import { Comment } from '../../entities/comment';
import { ObjectId } from 'mongodb';

@InputType()
export class CommentInput implements Partial<Comment> {
  @Field()
  content: string;

  @Field(type => ObjectId)
  replyOf: ObjectId
}
