import { InputType, Field } from 'type-graphql';
import { User, Gender } from '../../entities/user';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  email: string;
  @Field()
  realName: string;
  @Field()
  studentId: string;
  @Field()
  nickName: string;
  @Field()
  password: string;
  @Field({ nullable: true })
  avatar?: string;
}

@InputType()
export class UserUpdateInput implements Partial<User> {
  @Field({ nullable: true })
  realName?: string;
  @Field({ nullable: true })
  nickName?: string;
  @Field({ nullable: true })
  avatar?: string;
  @Field({ nullable: true })
  headline?: string
  @Field({ nullable: true })
  description?: string
  @Field({ nullable: true })
  gender?: Gender
}