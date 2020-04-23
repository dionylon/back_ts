import { Resolver, Subscription, Mutation, Arg, Root, PubSubEngine, PubSub, UseMiddleware } from 'type-graphql';
import { ResourceBaseResolver } from './Resouce';
import { Message, MessageModel } from '../entities/message';
import { MessageInput } from './input/message.input';
import { MessageType } from '../entities/message';
import { AuthAccess } from '../middlewares/auth-access';


export interface MsgPayload {
  msg: Message;
}

export const MessageTopics = {
  Whisper: "WHISPER",
  GroupTalk: "GROUPTALK"
}

@Resolver()
export class MessageResolver extends ResourceBaseResolver(Message, MessageModel, MessageInput) {

  @Subscription(
    () => Message,
    {
      topics: MessageTopics.Whisper,
      filter: ({ payload, context }) => {
        // 只能看到发给自己的消息
        return context.user._id == payload.msg.to;
      }
    }
  )
  async subscriptMessage(
    @Root() payload: MsgPayload,
  ) {
    return payload.msg;
  }


  @UseMiddleware(AuthAccess)
  @Mutation(() => Message)
  async sendWhisper(
    @Arg("message") message: MessageInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const mm = new MessageModel(
      {
        ...message,
        type: MessageType.Whisper
      }
    );
    const msg = await mm.save();
    // console.log(msg);
    pubSub.publish(MessageTopics.Whisper, { msg });
    return msg;
  }
}