// src/features/service-requests/api/staff-remote.adapter.ts
import { ServiceRequestsPort } from './port';
import { ServiceRequest, CreateRequestDTO, UpdateRequestDTO } from './types';
import { supabase } from '../../../lib/api/supabase';
import { AuthService, DepartmentService, PropertyService } from '../../../lib/services';
import { logger } from '../../../core/utils/logger';

export class StaffRemoteServiceRequestsAdapter implements ServiceRequestsPort {
  // ========== QUERIES ==========

  async getAll(): Promise<ServiceRequest[]> {
    logger.debug('ServiceRequests', '[STAFF] Fetching ALL service_requests (use getByDepartment instead)');

    await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('ServiceRequests', 'Error fetching requests', { error });
      throw error;
    }

    logger.info('ServiceRequests', '[STAFF] Fetched ALL requests', { count: data?.length });
    return data as ServiceRequest[];
  }

  async getById(id: string): Promise<ServiceRequest> {
    await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ServiceRequest;
  }

  async getByGuest(guestId: string): Promise<ServiceRequest[]> {
    logger.debug('ServiceRequests', '[STAFF] Fetching requests for guest', { guestId });

    await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        departments(name, code)
      `)
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('ServiceRequests', 'Error fetching guest requests', { error });
      throw error;
    }

    logger.info('ServiceRequests', 'Fetched guest requests', { count: data?.length });
    return data as ServiceRequest[];
  }

  async getByDepartment(departmentId: string): Promise<ServiceRequest[]> {
    logger.debug('ServiceRequests', '[STAFF] Fetching requests for department', { departmentId });

    await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        guests(name, email, room_number),
        departments(name, code)
      `)
      .eq('department_id', departmentId)
      .in('status', ['pending', 'assigned', 'in-progress'])
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('ServiceRequests', 'Error fetching department requests', { error });
      throw error;
    }

    logger.info('ServiceRequests', 'Fetched department requests', { count: data?.length });
    return data as ServiceRequest[];
  }

  // ========== MUTATIONS ==========

  async create(request: CreateRequestDTO): Promise<ServiceRequest> {
    const userId = await AuthService.getCurrentUserId();
    const departmentId = await DepartmentService.getDepartmentIdByType(request.type);
    const propertyId = await PropertyService.getDefaultPropertyId();

    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id: userId,
        guest_name: 'Staff Created',
        room_number: 'N/A',
        type: request.type,
        priority: request.priority,
        status: 'pending',
        title: request.title,
        description: request.description,
        department_id: departmentId,
        property_id: propertyId
      })
      .select()
      .single();

    if (error) {
      logger.error('ServiceRequests', 'Error creating request', { error });
      throw error;
    }

    logger.info('ServiceRequests', 'Request created', { data });
    return data as ServiceRequest;
  }

  async update(id: string, updates: UpdateRequestDTO): Promise<ServiceRequest> {
    await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ServiceRequest;
  }

  async updateStatus(id: string, status: string): Promise<ServiceRequest> {
    logger.info('ServiceRequests', '[STAFF] Updating request status', { id, status });

    await AuthService.getCurrentUserId();

    const updates: any = { status };

    if (status === 'in-progress' && !updates.started_at) {
      updates.started_at = new Date().toISOString();
    }

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('ServiceRequests', 'Error updating status', { error });
      throw error;
    }

    logger.info('ServiceRequests', 'Status updated successfully');
    return data as ServiceRequest;
  }

  async assignToStaff(id: string, staffId: string): Promise<ServiceRequest> {
    logger.info('ServiceRequests', '[STAFF] Assigning request to staff', { id, staffId });

    await AuthService.getCurrentUserId();

    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('name')
      .eq('id', staffId)
      .single();

    if (staffError || !staffData) {
      throw new Error('Staff member not found');
    }

    const { data, error } = await supabase
      .from('service_requests')
      .update({
        assigned_to: staffId,
        assigned_to_name: staffData.name,
        status: 'assigned',
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('assigned_to', null)
      .select()
      .single();

    if (error) {
      logger.error('ServiceRequests', 'Error assigning request', { error });
      throw error;
    }

    if (!data) {
      throw new Error('Request already assigned to another staff member');
    }

    logger.info('ServiceRequests', 'Request assigned successfully');
    return data as ServiceRequest;
  }

  async rate(id: string, rating: number, feedback?: string): Promise<ServiceRequest> {
    throw new Error('Unauthorized: Staff cannot rate requests');
  }

  async delete(id: string): Promise<void> {
    await AuthService.getCurrentUserId();

    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
