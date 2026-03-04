// ============================================
// TOURS - QUERY KEYS (Phase A.1)
// ============================================

export const tourKeys = {
  all: ['tours'] as const,
  lists: () => [...tourKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...tourKeys.lists(), filters] as const,
  details: () => [...tourKeys.all, 'detail'] as const,
  detail: (id: string) => [...tourKeys.details(), id] as const,
  featured: () => [...tourKeys.all, 'featured'] as const,
  byCategory: (category: string) => [...tourKeys.all, 'category', category] as const,
  
  // Bookings
  bookings: {
    all: ['tour-bookings'] as const,
    lists: () => [...tourKeys.bookings.all, 'list'] as const,
    byGuest: (guestId: string) => [...tourKeys.bookings.lists(), 'guest', guestId] as const,
    detail: (id: string) => [...tourKeys.bookings.all, 'detail', id] as const,
    stats: (tourId?: string) => [...tourKeys.bookings.all, 'stats', tourId] as const,
  },
};
