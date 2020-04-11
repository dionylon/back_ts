import { Resolver } from 'type-graphql';
import { User, UserModel } from '../entities/user';
import { ResourceBaseResolver } from 'src/resolvers/Resouce';



@Resolver(User)
export class UserResolver extends ResourceBaseResolver(User, UserModel, UserInput, UserUpdateInput) {

}


