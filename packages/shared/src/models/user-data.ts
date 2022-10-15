import { Model, modelOperations } from './model';

export interface UserData extends Model {
  relatedVotingEvents: string[];
}

interface RequiredAttributes extends Pick<UserData, never> { }

const create = <T extends RequiredAttributes>(data?: T): UserData & T => modelOperations.create(Object.assign({
  relatedVotingEvents: [],
}, data));

export const userDataOperations = {
  create,
};
