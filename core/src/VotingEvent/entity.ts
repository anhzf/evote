import { BaseEntity, IBaseEntity } from '../BaseEntity';

export interface IVotingEvent extends IBaseEntity {
  title: string;
  url?: string;
  isArchived: boolean;
  isClosed: boolean;
}

type RequiredAttrs = Pick<IVotingEvent, 'title'>;

export class VotingEvent extends BaseEntity<IVotingEvent, RequiredAttrs> implements IVotingEvent {
  title!: string;

  url?: string;

  isArchived = false;

  isClosed = true;

  toObj(trueId?: boolean): IVotingEvent {
    return {
      ...super.toObj(trueId),
      title: this.title,
      url: this.url,
      isArchived: this.isArchived,
      isClosed: this.isClosed,
    }
  }
}
