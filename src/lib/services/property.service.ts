// lib/services/property.service.ts
import { supabase } from '../api/supabase';
import { logger } from '../../core/utils/logger';

interface PropertyInfo {
  id: string;
  name: string;
  code?: string;
}

export class PropertyService {
  /**
   * Get default property ID (first property in DB)
   * @returns Property ID or null if none found
   */
  static async getDefaultPropertyId(): Promise<string | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .limit(1)
      .single();

    if (error) {
      logger.error('PropertyService', 'Error fetching default property', error);
      return null;
    }

    return data?.id || null;
  }

  /**
   * Get property by ID
   */
  static async getPropertyInfo(propertyId: string): Promise<PropertyInfo | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('id, name, code')
      .eq('id', propertyId)
      .single();

    if (error) {
      logger.error('PropertyService', 'Error fetching property info', error);
      return null;
    }

    return data;
  }

  /**
   * Get all properties
   */
  static async getAllProperties(): Promise<PropertyInfo[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('id, name, code')
      .order('name');

    if (error) {
      logger.error('PropertyService', 'Error fetching properties', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get property by name
   */
  static async getPropertyByName(name: string): Promise<PropertyInfo | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('id, name, code')
      .ilike('name', `%${name}%`)
      .limit(1)
      .single();

    if (error) {
      logger.error('PropertyService', 'Error fetching property by name', error);
      return null;
    }

    return data;
  }
}