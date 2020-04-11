import { Field, ObjectType, registerEnumType, Authorized } from 'type-graphql';
import { prop, getModelForClass, arrayProp } from '@typegoose/typegoose'
import { ObjectID } from 'mongodb'
export enum Gender {
  Unknown,
  Male,
  Female,
  Secret
}

registerEnumType(Gender, {
  name: 'Gender'
});

@ObjectType()
export class Badge {
  @Field()
  @prop()
  type: string;

  @Field()
  @prop()
  description: string;
}

@ObjectType()
export class User {
  @Field()
  readonly _id: ObjectID;

  @Field({
    description: '教育邮箱'
  })
  @prop({ unique: true })
  email: string;

  @Field()
  @prop()
  realName: string;

  @Field()
  @prop()
  nickName: string;

  @prop()
  password: string;

  @Field(type => Gender)
  @prop()
  gender: Gender = Gender.Unknown;

  @Field()
  @prop()
  studentId: string;

  @Field({ nullable: true })
  @prop()
  avatar?: string;

  @Field()
  @prop()
  headline: string = '';

  @Field()
  @prop()
  description: string = '';

  @Field(type => [Badge])
  @arrayProp({ items: Badge, default: [] })
  badges: Badge[];

  @Field()
  @prop({ default: true })
  is_active: boolean;

  @Field()
  @prop({ default: false })
  is_admin: boolean;

  @Authorized(["ADMIN"])
  @Field(type => [String])
  @arrayProp({ items: String })
  roles: string[] = [];

  @Field(type => String, { nullable: true, description: '用于登录和注册' })
  @prop({ default: '' })
  token: string;
}

export const UserModel = getModelForClass(User)
