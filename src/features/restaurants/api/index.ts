// ============================================
// RESTAURANTS API - BARREL (Phase B.1)
// ============================================

import { RemoteRestaurantsAdapter } from './remote.adapter';

// Export types
export * from './types';
export * from './port';

// Export adapter instance
export const restaurantsApi = new RemoteRestaurantsAdapter();

// Default export
export default restaurantsApi;
