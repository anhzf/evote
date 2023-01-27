import { Model, modelOperations } from './model';


export interface VotingEventUser extends Model {
  role: string;
}

interface RequiredAttributes extends Pick<VotingEventUser, 'role'> { }

const create = <T extends RequiredAttributes>(data?: T): VotingEventUser & T => modelOperations.create(Object.assign({
}, data));

export const privilegeOperations = {
  create,
};
