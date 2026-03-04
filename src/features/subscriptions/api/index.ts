// src/features/subscriptions/api/index.ts

import { isDemoMode } from '../../../config/demo-mode';
import { RemoteSubscriptionsAdapter } from './remote.adapter';
import { DemoSubscriptionsAdapter } from './demo.adapter';

export * from './types';
export * from './port';

export const subscriptionsApi = isDemoMode()
  ? new DemoSubscriptionsAdapter()
  : new RemoteSubscriptionsAdapter();

export default subscriptionsApi;
