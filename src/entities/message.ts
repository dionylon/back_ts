import { Field, ObjectType, registerEnumType, Authorized } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum MessageType {
  Whisper = "WHISPER",
  GroupTalk = "GROUPTALK",
  Broadcast = "BROADCAST"
}
registerEnumType(MessageType, { name: 'MessageType', description: "消息类型" });

@ObjectType()
export class Message extends TimeStamps {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @prop()
  from: ObjectId;

  @Field()
  @prop()
  to: ObjectId; // 可能是user id或者group id，取决于 type

  @Field(type => MessageType)
  @prop()
  type: MessageType;

  @Field({ description: "最大长度300" })
  @prop({ maxlength: 300 })
  content: string;

  @Field(type => Date)
  createdAt: Date
}

export const MessageModel = getModelForClass(Message);