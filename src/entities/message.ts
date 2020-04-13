import { Field, ObjectType, registerEnumType, Authorized } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { prop, getModelForClass } from '@typegoose/typegoose';

export enum MessageType {
  Whisper,
  GroupTalk
}
registerEnumType(MessageType, { name: 'MessageType' });

@ObjectType()
export class Message {
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

  @Field()
  @prop({ maxlength: 300 })
  content: string;

  @Field(type => Date)
  @prop()
  date: Date;
}

export const MessageModel = getModelForClass(Message);