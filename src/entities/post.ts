import { ObjectType, Field, Int } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { prop, arrayProp, getModelForClass } from '@typegoose/typegoose';
import { Ref } from "../types/Ref";
import { User } from './user';
import { Comment } from './comment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType()
export class Post extends TimeStamps {
  @Field()
  readonly _id: ObjectId;

  @Field(type => User)
  @prop({ index: true, ref: User })
  author: Ref<User>;

  @Field()
  @prop()
  content: string;

  @Field(type => [String], { nullable: true, description: "图片url列表" })
  @arrayProp({ items: String })
  imgList: Array<string>;

  @Field(type => Date)
  createdAt: Date;

  @Field(type => Date)
  updatedAt: Date;

  @Field(type => Int, { description: "评论数" })
  commentsCount: number;

}

export const PostModel = getModelForClass(Post);