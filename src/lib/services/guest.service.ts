// lib/services/guest.service.ts
import { supabase } from '../api/supabase';
import { logger } from '../../core/utils/logger';

interface GuestInfo {
  id: string;
  name: string;
  room_number: string;
  email?: string;
  phone?: string;
}

export class GuestService {
  /**
   * Get guest info by user ID
   * @param userId - User ID from auth
   * @returns Guest info with name and room number
   */
  static async getGuestInfo(userId: string): Promise<GuestInfo> {
    const { data, error } = await supabase
      .from('guests')
      .select('id, name, room_number, email, phone')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('GuestService', 'Error fetching guest info', error);
      // Return fallback data instead of throwing
      return {
        id: userId,
        name: 'Guest',
        room_number: 'N/A'
      };
    }

    return data;
  }

  /**
   * Get guest name by user ID
   */
  static async getGuestName(userId: string): Promise<string> {
    const guest = await this.getGuestInfo(userId);
    return guest.name;
  }

  /**
   * Get guest room number by user ID
   */
  static async getGuestRoom(userId: string): Promise<string> {
    const guest = await this.getGuestInfo(userId);
    return guest.room_number;
  }
}