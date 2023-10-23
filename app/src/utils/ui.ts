import { Loading, Notify } from 'quasar';

const defaultFormatError = (err: any) => err.message || String(err);

export const notifyAsyncError = async (fn: () => Promise<void>, formatError = defaultFormatError) => {
  try {
    await fn();
  } catch (err) {
    if (process.env.DEBUGGING) console.error(err);

    Notify.create({
      type: 'negative',
      message: formatError(err),
    });
  }
};

export const showTheLoadingAsync = async (fn: () => Promise<void>) => {
  Loading.show();

  try {
    await fn();
  } finally {
    Loading.hide();
  }
};

export const showTheLoadingAndNotifyErrorAsync = async (fn: () => Promise<void>, formatError = defaultFormatError) => {
  Loading.show();

  try {
    await fn();
  } catch (err) {
    if (process.env.DEBUGGING) console.error(err);

    Notify.create({
      type: 'negative',
      message: formatError(err),
    });
  } finally {
    Loading.hide();
  }
};
