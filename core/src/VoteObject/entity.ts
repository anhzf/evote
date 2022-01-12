import { BaseEntity, IBaseEntity } from '/BaseEntity';

export interface IVoteObject extends IBaseEntity {
  title: string;
  thumbnailSrc?: string;
}

type RequiredAttrs = Pick<IVoteObject, 'title'>;

export class VoteObject extends BaseEntity<IVoteObject, RequiredAttrs> implements IVoteObject {
  title!: string;

  thumbnailSrc?: string;
}
