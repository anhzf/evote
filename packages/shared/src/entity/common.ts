import { Timestamp } from 'firebase/firestore';
import * as v from 'valibot';

export const DateSchema = v.union([
  v.date(),
  v.pipe(v.instance(Timestamp), v.transform((val) => val.toDate())),
  v.pipe(v.string(), v.transform((val) => new Date(val))),
]);

export const TimestampsSchema = v.object({
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const TimestampsSchemaOnCreateSchema = v.object({
  createdAt: v.optional(DateSchema, () => new Date()),
  updatedAt: v.optional(DateSchema, () => new Date()),
});

export const TimestampsSchemaOnUpdateSchema = v.object({
  createdAt: DateSchema,
  updatedAt: v.optional(DateSchema, () => new Date()),
});
