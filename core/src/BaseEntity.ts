import { nanoid } from 'nanoid';

export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class BaseEntity<
  T,
  ConstructorAttrs extends Partial<T & IBaseEntity> = T & IBaseEntity
> implements IBaseEntity {
  #tempId = nanoid();

  #id?: string;

  createdAt = new Date();

  updatedAt = new Date();

  get id() {
    return this.#id || this.#tempId;
  }

  set id(v) {
    // force to assign
    this.set({ ['#id']: v } as unknown as Partial<T & IBaseEntity>);
  }

  constructor(attrs: ConstructorAttrs & Partial<T & IBaseEntity>) {
    this.set(attrs);
  }

  set(attrs: Partial<T & IBaseEntity>) {
    Object.assign(this, {
      updatedAt: new Date(),
    }, attrs);
  }
}
