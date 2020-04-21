import { InputType, Field } from 'type-graphql';
import { Post } from 'src/entities/post';
import { ObjectId } from 'mongodb';


@InputType()
export class PostInput implements Partial<Post> {
  @Field()
  content: string;

  @Field(type => [String], { description: "图片url列表", nullable: true })
  imgList: string[];
}

@InputType()
export class PostUpdateInput implements Partial<Post> {
  @Field()
  content: string;
}