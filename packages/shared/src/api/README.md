# Writing API Principles

- Removes unnecessary object name unless it handle the relation of the object. Our APIs will expose the object name for the usage.
  ```ts
  // api/session.ts

  // Don't ❌
  export const createSession = async (): Promise<string> => {};

  // Do ✅
  export const create = async (): Promise<string> => {};

  // using API (exposed API)
  sessionApi.create(/*  */);
  ```
- Explicitly types returned data type. This ensure fast understanding the codebase in the future.
- The schema parameter should the output of the validated schema. Meaning the schema validation occurs in the outside the API. This ensure composability for multiple platform (ex: browser form, HTTP request body validation).
  ```ts
  // Don't ❌
  export const create = async (data: CreateSchema): Promise<string> => {
    const validated = validate(CreateSchema, data);
    // ...do creation
  };
  // Do ✅
  export const create = async (data: CreateSchema): Promise<string> => {
    // ... do creation
  };

  // using API
  create(validate(CreateSchema, data));
  ```
- API that need validating schema should expose the schema.
  ```ts
  export const CreateSchema = v.object({/* */});

  export const create = async (data: CreateSchema): Promise<string> => {
    // ... do creation
  };

  // using API
  create(validate(CreateSchema, data));
  ```
