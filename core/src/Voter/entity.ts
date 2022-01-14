import { BaseEntity, IBaseEntity } from '../BaseEntity';

export interface IVoter extends IBaseEntity {
  user?: string;
  meta: Record<string, unknown>;
}

type RequiredAttrs = Partial<IVoter>;

export class Voter extends BaseEntity<IVoter, RequiredAttrs> implements IVoter {
  user?: string;

  meta = {};

  toObj(trueId?: boolean): IVoter {
    return {
      ...super.toObj(trueId),
      user: this.user,
      meta: this.meta,
    }
  }
}
