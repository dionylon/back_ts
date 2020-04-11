import { ResourceBaseResolver } from './Resouce';
import { Resolver } from 'type-graphql';
import { Group, GroupModel, School, SchoolModel } from '../entities/group';
import { GroupInput, GroupUpdateInput, SchoolInput, SchoolUpdateInput } from './input/group.input';


@Resolver()
export class GroupResolver extends ResourceBaseResolver(Group, GroupModel, GroupInput, GroupUpdateInput) {

}

@Resolver()
export class SchoolResolver extends ResourceBaseResolver(School, SchoolModel, SchoolInput, SchoolUpdateInput) {
}