// src/hooks/admin/useAdminProperty.ts — Get property info for the current admin user
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';
import { useAuthStore } from '../../lib/stores/useAuthStore';

export interface AdminProperty {
  id: string;
  name: string;
  code: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  timezone: string;
  currency: string;
  logo_url: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  onboarding_completed: boolean;
}

export function useAdminProperty() {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;

  return useQuery<AdminProperty | null>({
    queryKey: ['admin', 'property', userId],
    queryFn: async () => {
      // Get property via staff table (admin = manager in staff)
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('property_id')
        .eq('id', userId!)
        .single();

      if (staffError || !staffData?.property_id) {
        // Fallback: get first property
        const { data } = await supabase.from('properties').select('*').limit(1).single();
        return data as AdminProperty | null;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', staffData.property_id)
        .single();

      if (error) throw error;
      return data as AdminProperty;
    },
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
}
