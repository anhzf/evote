import { nanoid } from 'nanoid';

export interface OperationHandler<T, R = void> {
  (payload: T): Promise<R>;
}

interface EventHandler<T> {
  (payload?: T): Promise<void> | void;
}

type OperationListener<Fn extends CallableFunction> = {
  id: string;
  handler: Fn;
}

type RemoveListener = () => void;

export interface Operation<T, R = void> extends OperationHandler<T, R> {
  onBeforeCall: (handler: EventHandler<T>) => RemoveListener;
  onAfterCall: (handler: EventHandler<T>) => RemoveListener;
}

export interface Guard<T> {
  (payload?: T): boolean | Promise<boolean>;
}

export interface OperationDefinition<T, R = void> {
  name: string;
  handler: OperationHandler<T, R>;
  guards?: Guard<T>[];
  onBeforeCall?: EventHandler<T>;
  onAfterCall?: EventHandler<T>;
}

export const defineOperation = <T, R = void>(definition: OperationDefinition<T, R>): Operation<T, R> => {
  const onBefore: OperationListener<EventHandler<T>>[] = [];
  const onAfter: OperationListener<EventHandler<T>>[] = [];
  const operation: Operation<T, R> = async (payload): Promise<R> => {
    // sequentally call all guards, if guard return true then call next guard, if return false then abort
    await definition.guards?.reduce(async (p, guard) => {
      if (await p) {
        return Promise.resolve(guard(payload));
      }
      return false;
    }, Promise.resolve(true));

    // call all onBeforeCall handlers
    await Promise.all(onBefore.map((handler) => handler.handler(payload)));

    // ensuring to call onAfterCall handlers even if operation throws an error
    try {
      const result = await definition.handler(payload);
      return result;
    } finally {
      await Promise.all(onAfter.map((handler) => handler.handler(payload)));
    }
  };

  operation.onBeforeCall = (handler) => {
    const id = nanoid();
    onBefore.push({ id, handler });
    return () => {
      onBefore.splice(onBefore.findIndex((h) => h.id === id), 1);
    };
  };

  operation.onAfterCall = (handler) => {
    const id = nanoid();
    onAfter.push({ id, handler });
    return () => {
      onAfter.splice(onAfter.findIndex((h) => h.id === id), 1);
    };
  };

  return operation;
};
