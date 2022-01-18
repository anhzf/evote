import { BaseEntity, IBaseEntity } from '../BaseEntity';

export interface IVotingEvent extends IBaseEntity {
  title: string;
  url?: string;
  isArchived: boolean;
  isClosed: boolean;
  isResultsPublished: boolean;
}

type RequiredAttrs = Pick<IVotingEvent, 'title'>;

export class VotingEvent extends BaseEntity<IVotingEvent, RequiredAttrs> implements IVotingEvent {
  title!: string;

  url?: string;

  isArchived = false;

  isClosed = true;

  isResultsPublished = false;

  toObj(trueId = false): IVotingEvent {
    return {
      ...super.toObj(trueId),
      title: this.title,
      url: this.url,
      isArchived: this.isArchived,
      isClosed: this.isClosed,
      isResultsPublished: this.isResultsPublished,
    }
  }
}
