import { Field, ObjectType } from 'type-graphql';
import { prop, getModelForClass, arrayProp, getDiscriminatorModelForClass } from '@typegoose/typegoose'
import { ObjectID } from 'mongodb'


@ObjectType()
export class Group {
  @Field()
  readonly _id: ObjectID;

  @Field({ defaultValue: "" })
  readonly type: string

  @Field()
  @prop()
  name: string

  @Field({ nullable: true })
  @prop()
  avatar?: string

}

@ObjectType()
export class School extends Group {
  @Field({ description: '学校英文简称' })
  @prop()
  abbr: string
}

export const GroupModel = getModelForClass(Group, {
  schemaOptions: {
    discriminatorKey: 'type'
  }
})

export const SchoolModel = getDiscriminatorModelForClass(GroupModel, School)



