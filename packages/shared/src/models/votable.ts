import { Model, modelOperations } from './model';

export interface Votable extends Model {
  title: string;
  subtitle: string;
  thumbnailSrc?: string;
  ref?: string;
  desc?: string;
  number?: number;
}

interface RequiredAttributes extends Pick<Votable, 'title'> { }

const create = <T extends RequiredAttributes>(data?: T): Votable & T => modelOperations.create(Object.assign({
  subtitle: '',
  thumbnailSrc: '',
}, data));

export const votableOperations = {
  create,
};

export const sortVotables = (votables: Votable[]) => votables.sort((a, b) => (a.number || 0) - (b.number || 0));
