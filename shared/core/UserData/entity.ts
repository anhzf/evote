import { BaseEntity, IBaseEntity } from '../BaseEntity';

export interface IUserData extends IBaseEntity {
  relatedVotingEvents?: string[];
}

type RequiredAttrs = {};

export class UserData extends BaseEntity<IUserData, RequiredAttrs> implements IUserData {
  relatedVotingEvents: string[] = [];

  toObj(trueId = false): IUserData {
    return {
      ...super.toObj(trueId),
      relatedVotingEvents: this.relatedVotingEvents,
    };
  }
}
