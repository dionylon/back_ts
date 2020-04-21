import { ObjectType, Field } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { prop, arrayProp, getModelForClass } from '@typegoose/typegoose';
import { User } from './user';
import { Ref } from '../types/Ref';
import { Post } from './post';

@ObjectType()
export class Comment {
  @Field()
  readonly _id: ObjectId;

  @Field(type => User)
  @prop({ ref: User })
  author: Ref<User>;

  @Field({ description: "最多300字符" })
  @prop({ maxlength: 300 })
  content: string;

  @Field(type => Date)
  @prop()
  createBy: Date;

  @Field(type => Post)
  @prop({ ref: Post })
  replyOf: Ref<Post>;
}

export const CommentModel = getModelForClass(Comment);