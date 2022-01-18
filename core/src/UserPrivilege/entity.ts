import { BaseEntity, IBaseEntity } from '../BaseEntity';

export const Roles = ['OWNER', 'ADMIN', 'VOTE OBJECT HOLDER'] as const;

export type Role = typeof Roles[number];

export interface IUserPrivilege extends IBaseEntity {
  role?: Role;
  can?: string[];
}

type RequiredAttrs = {};

export class UserPrivilege extends BaseEntity<IUserPrivilege, RequiredAttrs> implements IUserPrivilege {
  role?: Role;

  can?: string[] = [];

  toObj(trueId?: boolean): IUserPrivilege {
    return {
      ...super.toObj(trueId),
      role: this.role,
    }
  }
}
