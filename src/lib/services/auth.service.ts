// lib/services/auth.service.ts
import { supabase } from '../api/supabase';
import { logger } from '../../core/utils/logger';

export class AuthService {
  /**
   * Get current authenticated user
   * @throws Error if user not authenticated
   */
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      logger.error('AuthService', 'Error getting current user', error);
      throw new Error('Failed to get current user');
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return user;
  }

  /**
   * Get current user ID
   * @throws Error if user not authenticated
   */
  static async getCurrentUserId(): Promise<string> {
    const user = await this.getCurrentUser();
    return user.id;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}