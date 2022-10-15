import { Model, modelOperations } from './model';

export interface Votable extends Model {
  title: string;
  subtitle: string;
  thumbnailSrc?: string;
  ref?: string;
}

interface RequiredAttributes extends Pick<Votable, 'title'> { }

const create = <T extends RequiredAttributes>(data?: T): Votable & T => modelOperations.create(Object.assign({
  subtitle: '',
  thumbnailSrc: '',
}, data));

export const votableOperations = {
  create,
};
