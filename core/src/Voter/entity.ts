import { BaseEntity, IBaseEntity } from '../BaseEntity';

export interface IVoter extends IBaseEntity {
  userId?: string;
  meta: Record<string, any>;
}

type RequiredAttrs = Partial<IVoter>;

export class Voter extends BaseEntity<IVoter, RequiredAttrs> implements IVoter {
  userId?: string;

  meta = {};

  toObj(trueId = false): IVoter {
    return {
      ...super.toObj(trueId),
      userId: this.userId,
      meta: this.meta,
    }
  }
}
