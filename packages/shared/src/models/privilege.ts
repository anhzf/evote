import { Model, modelOperations } from './model';

export interface Privilege extends Model {
  name: string;
  can: string[];
}

interface RequiredAttributes extends Pick<Privilege, 'name'> { }

const create = <T extends RequiredAttributes>(data?: T): Privilege & T => modelOperations.create(Object.assign({
  can: [],
}, data));

export const privilegeOperations = {
  create,
};
