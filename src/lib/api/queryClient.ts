// src/lib/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

/**
 * Global React Query client configuration
 * Enterprise-grade settings for caching and error handling
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache duration
      staleTime: 1000 * 60 * 5, // 5 minutes - Data considered fresh for 5 min
      gcTime: 1000 * 60 * 30,   // 30 minutes - Cache kept for 30 min (formerly cacheTime)
      
      // Refetch behavior
      refetchOnWindowFocus: false, // Don't refetch when user returns to tab
      refetchOnReconnect: true,    // Refetch when internet reconnects
      refetchOnMount: true,        // Refetch when component mounts
      
      // Retry logic
      retry: 1, // Only retry once on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry logic for mutations
      retry: 1, // Only retry once
      retryDelay: 1000,
    },
  },
});