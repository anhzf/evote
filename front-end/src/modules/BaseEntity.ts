import { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { IBaseEntity } from '@evote/core';

export const BaseEntityConverter = {
  fillEntity: <T extends IBaseEntity>(snapshot: QueryDocumentSnapshot<T>): T => {
    const {
      createdAt, updatedAt, deletedAt, ...data
    } = snapshot.data();

    return {
      ...data,
      id: snapshot.id,
      updatedAt: (updatedAt as unknown as Timestamp)?.toDate(),
      createdAt: (createdAt as unknown as Timestamp)?.toDate(),
      deletedAt: (deletedAt as unknown as Timestamp)?.toDate(),
    } as T;
  },
};
