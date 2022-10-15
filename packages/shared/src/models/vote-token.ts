import { Model, modelOperations, SoftDelete } from './model';

export interface VoteToken extends Model, SoftDelete {
  voter: string;
  voted?: string;
  points?: number;
  meta: Record<string, any>;
}

interface RequiredAttributes extends Pick<VoteToken, 'voter'> { }

const create = <T extends RequiredAttributes>(data?: T): VoteToken & T => modelOperations.create(Object.assign({
  meta: {},
}, data));

export const voteTokenOperations = {
  create,
};
