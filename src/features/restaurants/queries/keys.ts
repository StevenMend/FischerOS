// ============================================
// RESTAURANTS - QUERY KEYS (Phase B.1)
// ============================================

export const restaurantKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...restaurantKeys.lists(), { filters }] as const,
  details: () => [...restaurantKeys.all, 'detail'] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  byCuisine: (cuisine: string) => [...restaurantKeys.all, 'cuisine', cuisine] as const,
  featured: () => [...restaurantKeys.all, 'featured'] as const,
};

export const reservationKeys = {
  all: ['restaurant-reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (guestId: string) => [...reservationKeys.lists(), guestId] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: string) => [...reservationKeys.details(), id] as const,
  stats: (restaurantId?: string) => 
    [...reservationKeys.all, 'stats', restaurantId || 'all'] as const,
};
