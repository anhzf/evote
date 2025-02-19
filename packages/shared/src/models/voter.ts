import { Model, modelOperations, type HasSearchableFields } from './model';

export interface Voter extends Model, HasSearchableFields {
  userId?: string;
  meta: Record<string, any>;
  isVoted: boolean;
}

interface RequiredAttributes extends Pick<Voter, never> { }

const create = <T extends RequiredAttributes>(data?: T): Voter & T => modelOperations.create(Object.assign({
  meta: {},
  isVoted: false,
  $search: {},
}, data));

export const voterOperations = {
  create,
};
