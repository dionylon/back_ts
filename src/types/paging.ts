import { ObjectType, Field, Int, ClassType, InputType } from 'type-graphql';
import { GraphQLScalarType } from 'graphql'
import { ObjectId } from 'mongodb';
import { Model, Document, FilterQuery } from 'mongoose'

export const CursorScalar = new GraphQLScalarType({
  name: 'Cursor',
  description: '实际就是any类型,用于paging.after',
  parseValue(val: any) {
    return val; // value from the client input variables
  },
  serialize(val: any) {
    return val; // value sent to the client
  },
});

@InputType()
export class PagingArgs {
  @Field(type => String, { defaultValue: '_id', description: '前面加号为正序,减号为逆序' })
  sort = '_id';

  @Field(type => Int, { defaultValue: 0, description: '如果和after一起使用,意思是在after之后跳过n项' })
  skip = 0;

  @Field(type => CursorScalar, {
    nullable: true,
    description: '上一个列表最后一项中排序字段的值,用于加速分页.如果它和skip一起使用,意思是在它之后跳过n项'
  })
  after?: any;

  @Field(type => Int, { defaultValue: 10 })
  limit = 10;

  @Field(type => Int, { nullable: true, description: '如果为空则会从数据库中获取,否则直接返回传入的值' })
  total?: number

  isDesc = this.sort.startsWith('-')

  get afterQuery(): Record<string, Record<string, any>> | null {
    if (!this.after) return null
    let key;
    if (this.sort.startsWith('+') || this.sort.startsWith('-'))
      key = this.sort.slice(1)
    else
      key = this.sort
    let after = this.after
    if (key === '_id')
      after = new ObjectId(after)
    if (this.isDesc) return { [key]: { $lt: after } }
    else return { [key]: { $gt: after } }
  }
}

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    // here we use the runtime argument
    @Field(type => [TItemClass])
    // and here the generic type
    items: TItem[];

    @Field(type => Int)
    total: number;

    @Field()
    hasMore: boolean;

  }
  return PaginatedResponseClass;
}

export async function fetchPaginatedResponse<T extends Document>(
  Model: Model<InstanceType<ClassType<T>>>, conditions: FilterQuery<T>, paging: PagingArgs)
  : Promise<{ items: T[], total: number, hasMore: boolean }> {
  const afterQuery = paging.afterQuery || {}
  const total = paging.total ?? await Model.find({ ...conditions }).count()
  const items = await Model
    .find({
      ...conditions,
      ...afterQuery
    })
    .sort(paging.sort)
    .skip(paging.skip)
    .limit(paging.limit)
  return {
    items,
    total,
    hasMore: items.length === paging.limit // 只能这样写了,有误伤,但也没办法
  }
}
