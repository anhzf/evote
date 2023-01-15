import { nanoid } from 'nanoid';

export interface Model {
  uid: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SoftDelete {
  deletedAt?: Date;
}

interface RequiredAttributes extends Pick<Model, never> { }

const create = <T extends RequiredAttributes>(data?: T): Model & T => Object.assign({
  uid: nanoid(),
  createdAt: new Date(),
  updatedAt: new Date(),
}, data);

export const modelOperations = {
  create,
}
