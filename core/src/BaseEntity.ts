import { nanoid } from 'nanoid';

export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class BaseEntity<
  T,
  ConstructorAttrs extends Partial<T & IBaseEntity> = T & IBaseEntity,
> implements IBaseEntity {
  #tempId = nanoid();

  #id?: string;

  createdAt = new Date();

  updatedAt = new Date();

  deletedAt?: Date;

  get id() {
    return this.#id || this.#tempId;
  }

  // when setting id, the updatedAt property does not get updated
  set id(v) {
    this.#id = v;
  }

  // deprecated due to unexpected behaviour
  // constructor (attrs: ConstructorAttrs & Partial<T & IBaseEntity>) {
  //   this.set(attrs);
  // }

  fill(attrs: ConstructorAttrs & Partial<T & IBaseEntity>): this {
    this.set(attrs);
    return this;
  }

  set(attrs: Partial<T & IBaseEntity>): this {
    this.updatedAt = new Date();

    Object.entries(attrs)
      .forEach(([key, value]) => {
        this[key as keyof BaseEntity<T, ConstructorAttrs>] = value;
      });

    return this;
  }

  toObj(trueId = false): IBaseEntity {
    return {
      id: trueId ? this.id : (this.#id || ''),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }
}
