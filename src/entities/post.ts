import { ObjectType, Field } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { prop, arrayProp, getModelForClass } from '@typegoose/typegoose';
import { Ref } from "../types/Ref";
import { User } from './user';
import { Comment } from './comment';

@ObjectType()
export class Post {
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
  @prop({ index: true })
  createBy: Date;

  @Field(type => Date)
  @prop({ index: true })
  updateBy: Date;

  @Field(type => [Comment], { defaultValue: [] })
  comments: Array<Comment>;
}

export const PostModel = getModelForClass(Post);