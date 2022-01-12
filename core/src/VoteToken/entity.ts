import { BaseEntity, IBaseEntity } from '/BaseEntity';

export interface IVoteToken extends IBaseEntity {
  voter: string;
  voted: string;
  cached: Record<string, unknown>;
}

type RequiredAttrs = Pick<IVoteToken, 'voter' | 'voted'>;

export class VoteToken extends BaseEntity<IVoteToken, RequiredAttrs> implements IVoteToken {
    voter!: string;

    voted!: string;

    cached = {};
}
