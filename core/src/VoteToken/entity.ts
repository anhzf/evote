import { BaseEntity, IBaseEntity } from '../BaseEntity';

export interface IVoteToken extends IBaseEntity {
  voter: string;
  voted?: string;
  meta: Record<string, unknown>;
}

type RequiredAttrs = Pick<IVoteToken, 'voter'>;

export class VoteToken extends BaseEntity<IVoteToken, RequiredAttrs> implements IVoteToken {
  voter!: string;

  voted?: string;

  meta = {};

  toObj(trueId = false): IVoteToken {
    return {
      ...super.toObj(trueId),
      voter: this.voter,
      voted: this.voted,
      meta: this.meta,
    }
  }
}
