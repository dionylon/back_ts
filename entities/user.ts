import 'reflect-metadata';
import { ObjectType, ID, Field } from 'type-graphql';

@ObjectType()
export class User {
  @Field(type => ID)
  _id: string;

  @Field()
  nickName: string;

  @Field()
  email: string;

  @Field()
  password: string
}