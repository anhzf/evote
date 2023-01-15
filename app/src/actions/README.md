# GUIDE FOR WRITING ACTIONS

## Always explicitly type `defineOperation()`
It will make operations easier to read and understand.

Don't:
```ts
const myOperation = defineOperation({
  // ...
})
```

Do:
```ts
const myOperation = defineOperation<Payload, void>({
  // ...
})
```
