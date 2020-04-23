import { ObjectType, Field } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { prop, arrayProp, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './user';
import { Post } from './post';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType({ description: "评论" })
export class Comment extends TimeStamps {
  @Field()
  readonly _id: ObjectId;

  @Field(type => User)
  @prop({ ref: User })
  author: Ref<User>;

  @Field({ description: "最多300字符" })
  @prop({ maxlength: 300 })
  content: string;

  // 由mongodb自动生成
  @Field(type => Date)
  createdAt: Date;

  @Field(type => Post, { description: "评论的对象" })
  @prop({ ref: Post })
  parent: Ref<Post>;

  @Field(type => [Reply], { description: "评论的回复列表" })
  replyList: Array<Reply>;

  @Field({ description: "回复的个数" })
  replyCount: number;

}
/**
 * 某人回复某人的评论，就构成了reply，
 * reply可以回复reply，但是他们都属于一个comment的replyList
 * 以 张三: @李四： [回复的内容]
 * 的形式展现，只有两级，结构简单，方便实现提醒
 */
@ObjectType({ description: "评论的回复" })
export class Reply extends TimeStamps {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @prop({ maxlength: 300 })
  content: string;

  @Field(type => User, { description: "回复的作者" })
  @prop({ ref: User })
  from: Ref<User>;

  @Field(type => User, { description: "回复的对象,为空说明直接回复父评论", nullable: true })
  @prop({ ref: User, required: false })
  to: Ref<User>;

  @Field(type => Comment, { description: "父评论" })
  @prop({ ref: Comment, index: true })
  parent: Ref<Comment>;

  @Field(type => Post, { description: "回复所属的post" })
  @prop({ ref: Post, index: true })
  post: Ref<Post>;

  @Field(type => Date)
  createdAt: Date;

}
export const ReplyModel = getModelForClass(Reply);
export const CommentModel = getModelForClass(Comment);