import { createServiceRegistry } from './service-registry';
import type { Firestore } from 'firebase/firestore';

const registry = createServiceRegistry();

export const setupFirestore = (fn: (() => Firestore)) => registry.register.named('firestore', fn);
export const getFirestore = () => registry.get<Firestore>('firestore');

const DEFAULT_IS_SERVER: () => boolean = () => false;

export const setupIsServer = (fn = DEFAULT_IS_SERVER) => registry.register.named('isServer', fn);
export const isServer = () => registry.get<() => boolean>('isServer') ?? DEFAULT_IS_SERVER;
