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

  /**
   * Route a service request to a different department (cross-dept handoff).
   * Unassigns current staff, updates department_id and type, resets to pending.
   */
  static async routeRequestToDepartment(
    requestId: string,
    targetType: string,
    notes?: string
  ): Promise<boolean> {
    const departmentId = await this.getDepartmentIdByType(targetType);
    if (!departmentId) {
      logger.error('DepartmentService', 'Target department not found', { targetType });
      return false;
    }

    // Fetch current description to append handoff notes
    let newDescription: string | undefined;
    if (notes) {
      const { data: current } = await supabase
        .from('service_requests')
        .select('description')
        .eq('id', requestId)
        .single();
      newDescription = `${current?.description || ''}\n\n[Handoff] ${notes}`;
    }

    const updates: Record<string, any> = {
      department_id: departmentId,
      type: targetType,
      status: 'pending',
      assigned_to: null,
      assigned_to_name: null,
      ...(newDescription && { description: newDescription }),
    };

    const { error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', requestId);

    if (error) {
      logger.error('DepartmentService', 'Failed to route request', { requestId, targetType, error });
      return false;
    }

    logger.info('DepartmentService', 'Request routed', { requestId, targetType, departmentId });
    return true;
  }
}