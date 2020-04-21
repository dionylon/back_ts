import { Model } from 'mongoose';
import { Resolver, Query, Arg, Mutation, ClassType, ObjectType } from 'type-graphql';
import * as Case from 'case'
import { ObjectIdScalar } from '../types/object-id.scalar';
import { ObjectId } from 'mongodb';
import { PagingArgs, PaginatedResponse, fetchPaginatedResponse } from '../types/paging'

export function ResourceBaseResolver<T extends ClassType, C = Partial<T>>(ResourceClass: T,
  ResourceModel: Model<InstanceType<T>>, CreateInputClass: ClassType<C>) {
  const clsName = Case.pascal(ResourceClass.name)
  const snakedClsName = Case.snake(clsName)
  const camelClsNameWithPrefix = (prefix: string) => Case.camel(prefix + clsName)

  @ObjectType(`Paginated${clsName}Response`)
  class PaginatedResourceResponse extends PaginatedResponse(ResourceClass) { }

  @Resolver(of => ResourceClass, { isAbstract: true })
  abstract class ResourceBaseResolverClass {

    @Query(returns => ResourceClass, { name: snakedClsName })
    protected async getOne(@Arg('id', type => ObjectIdScalar) id: ObjectId) {
      return ResourceModel.findById(id)
    }

    @Query(returns => PaginatedResourceResponse, { name: snakedClsName + 's' })
    protected async getAll(@Arg('paging', type => PagingArgs) paging: PagingArgs) {
      return await fetchPaginatedResponse(ResourceModel, {}, paging)
    }

    @Mutation(returns => ResourceClass, { name: camelClsNameWithPrefix('new') })
    protected async createOne(@Arg(snakedClsName, type => CreateInputClass) input: Partial<T>) {
      let resource = new ResourceModel(input)
      resource = await resource.save()
      console.log(resource)
      return resource
    }
  }
  return ResourceBaseResolverClass
}
