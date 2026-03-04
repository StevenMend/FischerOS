// src/hooks/useRealtimeSubscription.ts — Generic Supabase Realtime → React Query bridge
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/api/supabase';
import { logger } from '../core/utils/logger';

interface SubscriptionConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

/**
 * Subscribe to Supabase postgres_changes and auto-invalidate React Query caches.
 *
 * @param channelName — unique channel identifier
 * @param subscriptions — tables/events to listen to
 * @param queryKeysToInvalidate — React Query keys to invalidate on any change
 * @param enabled — disable when no user/dept id yet
 */
export function useRealtimeSubscription(
  channelName: string,
  subscriptions: SubscriptionConfig[],
  queryKeysToInvalidate: readonly (readonly unknown[])[],
  enabled = true
) {
  const queryClient = useQueryClient();
  // Stable ref to avoid re-subscribing on every render
  const keysRef = useRef(queryKeysToInvalidate);
  keysRef.current = queryKeysToInvalidate;

  useEffect(() => {
    if (!enabled || subscriptions.length === 0) return;

    logger.debug('Realtime', `Subscribing to channel: ${channelName}`, { tables: subscriptions.map(s => s.table) });

    let channel = supabase.channel(channelName);

    for (const sub of subscriptions) {
      channel = channel.on(
        'postgres_changes' as any,
        {
          event: sub.event || '*',
          schema: 'public',
          table: sub.table,
          ...(sub.filter ? { filter: sub.filter } : {}),
        },
        () => {
          logger.debug('Realtime', `Change on ${sub.table} via ${channelName}`);
          for (const key of keysRef.current) {
            queryClient.invalidateQueries({ queryKey: [...key] });
          }
        }
      );
    }

    channel.subscribe();

    return () => {
      logger.debug('Realtime', `Unsubscribing from channel: ${channelName}`);
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, enabled]);
}
