import { Resolver, Mutation, Arg, Query, PubSub, PubSubEngine, Root } from 'type-graphql';
import { User, UserModel } from '../entities/user';
import { ResourceBaseResolver } from './Resouce';
import { UserInput, UserUpdateInput } from './input/user.input';
import { hashPassword, validatePassword, createToken, pasrseToken } from '../utils';

@Resolver()
export class UserResolver extends ResourceBaseResolver(User, UserModel, UserInput) {

  @Mutation(returns => User)
  async newUser(@Arg("user") input: UserInput) {
    let user = new UserModel(input);
    user.password = hashPassword(user.password);
    user = await user.save();
    user.token = createToken(user);
    return user;
  }

  @Query(returns => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') rawPassword: string
  ) {
    const password = hashPassword(rawPassword);
    const user = await UserModel.findOne({
      email
    });
    if (!user || !validatePassword(rawPassword, user.password)) {
      return;
    }
    user.token = createToken(user);
    return user;
  }
}


