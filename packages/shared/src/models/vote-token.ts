import { customAlphabet } from 'nanoid';
import { Model, modelOperations, SoftDelete } from './model';

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

export interface VoteToken extends Model, SoftDelete {
  voter: string;
  voted?: string | null;
  points?: number;
  meta: Record<string, any>;
}

interface RequiredAttributes extends Pick<VoteToken, 'voter'> { }

const create = <T extends RequiredAttributes>(data?: T): VoteToken & T => modelOperations.create(Object.assign({
  meta: {},
  // override
  uid: nanoid(),
  deletedAt: undefined,
  voted: null,
}, data));

export const voteTokenOperations = {
  create,
};

export const isTokenUsed = (token: VoteToken) => token.voted !== undefined;
