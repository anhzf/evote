import type { Firestore } from 'firebase/firestore';
import { createServiceRegistry } from './service-registry';

export const serviceRegistry = createServiceRegistry();

export const setupFirestore = (fn: (() => Firestore)) => serviceRegistry.register('firestore', fn);
export const getFirestore = () => serviceRegistry.get<Firestore>('firestore');

const DEFAULT_IS_SERVER: () => boolean = () => false;

export const setupIsServer = (fn = DEFAULT_IS_SERVER) => serviceRegistry.register('isServer', fn);
export const isServer = () => serviceRegistry.get<boolean>('isServer', DEFAULT_IS_SERVER);
