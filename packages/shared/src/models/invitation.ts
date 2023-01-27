import { Model, modelOperations } from './model';

export interface Invitation extends Model {
  expiredAt: Date;
  acceptedAt?: Date;
  email?: string;
  role?: string;
}

interface RequiredAttributes extends Pick<Invitation, 'expiredAt'> { }

const create = <T extends RequiredAttributes>(data?: T): Invitation & T => modelOperations.create(Object.assign({
}, data));

export const invitationOperations = {
  create,
};
