import { Model, modelOperations } from './model';

export interface VotingEvent extends Model {
  title: string;
  url?: string;
  isArchived: boolean;
  isClosed: boolean;
  isResultPublished: boolean;
}

interface RequiredAttributes extends Pick<VotingEvent, 'title'> { }

export interface VotingEventSummary {
  used: number;
  total: number;
  [votableId: string]: number;
}

const create = <T extends RequiredAttributes>(data?: T): VotingEvent & T => modelOperations.create(Object.assign({
  isArchived: false,
  isClosed: false,
  isResultPublished: false,
}, data));

export const votingEventOperations = {
  create,
};
