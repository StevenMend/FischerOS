// src/hooks/guest/useGuestInfo.ts — Real guest profile from Supabase `guests` table
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';
import { useAuthStore } from '../../lib/stores/useAuthStore';
import { logger } from '../../core/utils/logger';

export interface GuestInfo {
  id: string;
  name: string;
  room_number: string;
  email?: string;
  phone?: string;
  check_in?: string;
  check_out?: string;
  status?: string;
  [key: string]: unknown;
}

async function fetchGuestInfo(userId: string): Promise<GuestInfo | null> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    logger.warn('useGuestInfo', 'Could not fetch guest profile', error);
    return null;
  }

  return data as GuestInfo;
}

export function useGuestInfo() {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id || '';

  return useQuery({
    queryKey: ['guest-info', userId],
    queryFn: () => fetchGuestInfo(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
