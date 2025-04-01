import { serviceRegistry } from '~/lib/services/registry';

export const isServer = serviceRegistry.register(() => import.meta.server);
