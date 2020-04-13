import { InputType, Field } from 'type-graphql';
import { Message, MessageType } from '../../entities/message';
import { ObjectId } from 'mongodb';


@InputType()
export class MessageInput implements Partial<Message> {
  @Field()
  from: ObjectId;
  @Field()
  to: ObjectId;
  @Field()
  type: MessageType;
  @Field()
  content: string;
}