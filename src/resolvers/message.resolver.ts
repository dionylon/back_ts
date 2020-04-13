import { Resolver, Subscription, Mutation, Args, Arg, Root, PubSubEngine, PubSub, UseMiddleware } from 'type-graphql';
import { ResourceBaseResolver } from './Resouce';
import { Message, MessageModel } from '../entities/message';
import { MessageInput } from './input/message.input';
import { ObjectId } from 'mongodb';
import { MessageType } from '../entities/message';
import { Access } from '../middlewares/access';


export interface MsgPayload {
  msg: Message;
}


@Resolver()
export class MessageResolver extends ResourceBaseResolver(Message, MessageModel, MessageInput) {

  @Subscription(
    returns => Message,
    {
      topics: "MSG",
      filter: ({ args, payload, context }) => {
        return args.id == payload.id;
      }
    }
  )
  async subscriptMessage(
    @Root() payload: MsgPayload,
    @Arg("id", { description: "订阅对象的id" }) id: string
  ) {
    return payload.msg;
  }

  @Mutation(returns => Message)
  async sendWhisper(
    @Arg("from") from: ObjectId,
    @Arg("to") to: ObjectId,
    @Arg("content") content: string,
    @PubSub() pubSub: PubSubEngine
  ) {
    const message = new MessageModel(
      {
        from, to, content,
        type: MessageType.Whisper,
        date: new Date()
      }
    );
    const msg = await message.save();
    // console.log(msg);
    pubSub.publish("MSG", { id: msg.from, msg });
    return msg;
  }
}