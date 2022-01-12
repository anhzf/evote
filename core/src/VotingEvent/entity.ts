import { BaseEntity, IBaseEntity } from '/BaseEntity';

export interface IVotingEvent extends IBaseEntity {
  name: string;
  path?: string;
  isArchived: boolean;
}

type RequiredAttrs = Pick<IVotingEvent, 'name'>;

export class VotingEvent extends BaseEntity<IVotingEvent, RequiredAttrs> implements IVotingEvent {
  name!: string;

  path?: string;

  isArchived = false;
}
