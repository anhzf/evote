import * as v from 'valibot';

export const FirebaseUser = v.object({
  uid: v.string(),
  displayName: v.string(),
  photoURL: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerified: v.optional(v.boolean(), false),
});
