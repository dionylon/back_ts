import { Resolver, Mutation, Arg, Query, PubSub, PubSubEngine, Root, UseMiddleware } from 'type-graphql';
import { User, UserModel } from '../entities/user';
import { ResourceBaseResolver } from './Resouce';
import { UserInput, UserUpdateInput } from './input/user.input';
import { hashPassword, validatePassword, createToken, pasrseToken } from '../utils';
import { ObjectId } from 'mongodb';
import { OwnerAccess } from '../middlewares/owner-access';

@Resolver()
export class UserResolver extends ResourceBaseResolver(User, UserModel, UserInput) {

  @Mutation(returns => User)
  async newUser(@Arg("user") input: UserInput) {
    let user = new UserModel(input);
    user.password = hashPassword(user.password);
    user = await user.save();
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
    user.token = createToken({ id: user._id, roles: user.roles });
    return user;
  }

  @Mutation(returns => Boolean)
  @UseMiddleware(OwnerAccess)
  async updateUser(
    @Arg("id") id: ObjectId,
    @Arg("user") user: UserUpdateInput
  ) {
    const res = await UserModel.updateOne({ _id: id }, { ...user });
    // console.log(res);
    // { n: 1, nModified: 1, ok: 1 }
    return res.ok == 1;
  }
}


