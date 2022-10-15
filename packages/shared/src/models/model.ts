import { nanoid } from 'nanoid';

export interface Model {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface SoftDelete {
  deletedAt?: Date;
}

interface RequiredAttributes extends Pick<Model, never> { }

const create = <T extends RequiredAttributes>(data?: T): Model & T => Object.assign({
  id: nanoid(),
  createdAt: new Date(),
  updatedAt: new Date(),
}, data);

export const modelOperations = {
  create,
}
