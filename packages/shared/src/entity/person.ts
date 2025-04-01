import * as v from 'valibot';

export const Person = v.object({
  displayName: v.string(),
});
