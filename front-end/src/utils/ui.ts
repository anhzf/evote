import { Notify } from 'quasar';

export const promiseHandler = <T>(promise: Promise<T>) => promise
  .catch((err) => {
    Notify.create({
      message: String(err),
      color: 'negative',
    });
  });
