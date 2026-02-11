// lib/services/department.service.ts
import { supabase } from '../api/supabase';
import { logger } from '../../core/utils/logger';

// Department code mapping
const DEPARTMENT_CODES: Record<string, string> = {
  'housekeeping': 'HK',
  'maintenance': 'MT',
  'concierge': 'CO',
  'dining': 'FB',
  'spa': 'SP',
  'tour': 'TO',
  'transportation': 'TR',
  'general': 'GR'
};

interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
}

export class DepartmentService {
  /**
   * Get department ID by code
   * @param code - Department code (HK, MT, CO, etc.)
   * @returns Department ID or null if not found
   */
  static async getDepartmentIdByCode(code: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('departments')
      .select('id')
      .eq('code', code)
      .single();

    if (error) {
      logger.error('DepartmentService', `Error fetching department for code ${code}`, error);
      return null;
    }

    return data?.id || null;
  }

  /**
   * Get department ID by request type
   * @param type - Request type (housekeeping, maintenance, etc.)
   * @returns Department ID or null if not found
   */
  static async getDepartmentIdByType(type: string): Promise<string | null> {
    const code = DEPARTMENT_CODES[type.toLowerCase()] || 'GR';
    return this.getDepartmentIdByCode(code);
  }

  /**
   * Get department info by ID
   */
  static async getDepartmentInfo(departmentId: string): Promise<DepartmentInfo | null> {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, code')
      .eq('id', departmentId)
      .single();

    if (error) {
      logger.error('DepartmentService', 'Error fetching department info', error);
      return null;
    }

    return data;
  }

  /**
   * Get all departments
   */
  static async getAllDepartments(): Promise<DepartmentInfo[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, code')
      .order('name');

    if (error) {
      logger.error('DepartmentService', 'Error fetching departments', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get department code for a request type
   */
  static getDepartmentCode(type: string): string {
    return DEPARTMENT_CODES[type.toLowerCase()] || 'GR';
  }
}