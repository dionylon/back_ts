import { InputType, Field } from 'type-graphql';
import { Group, School } from 'src/entities/group';


@InputType()
export class GroupInput implements Partial<Group> {
  @Field()
  name: string

  @Field({ nullable: true })
  avatar?: string
}

@InputType()
export class SchoolInput extends GroupInput implements Partial<School> {
  @Field()
  abbr: string
}

@InputType()
export class GroupUpdateInput implements Partial<Group> {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  avatar?: string
}

@InputType()
export class SchoolUpdateInput extends GroupUpdateInput implements Partial<School> {
  @Field({ nullable: true })
  abbr?: string
}

