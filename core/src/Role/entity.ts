import { BaseEntity, IBaseEntity } from '../BaseEntity';

export const USER_ROLES = ['OWNER', 'ADMIN', 'VOTE OBJECT HOLDER'] as const;

export type UserRole = typeof USER_ROLES[number];

export interface IRole extends IBaseEntity {
  user: string;
  role?: UserRole;
}

type RequiredAttrs = Pick<IRole, 'user'>;

export class Role extends BaseEntity<IRole, RequiredAttrs> implements IRole {
  user!: string;

  role?: UserRole;

  toObj(trueId?: boolean): IRole {
    return {
      ...super.toObj(trueId),
      user: this.user,
      role: this.role,
    }
  }
}
