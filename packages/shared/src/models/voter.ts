import { Model, modelOperations } from './model';

export interface Voter extends Model {
  userId?: string;
  meta: Record<string, any>;
}

interface RequiredAttributes extends Pick<Voter, never> { }

const create = <T extends RequiredAttributes>(data?: T): Voter & T => modelOperations.create(Object.assign({
  meta: {},
}, data));

export const voterOperations = {
  create,
};
