// // // src/features/service-requests/api/remote.adapter.ts
// // import { ServiceRequestsPort } from './port'
// // import { ServiceRequest, CreateRequestDTO, UpdateRequestDTO } from './types'
// // import { supabase } from '../../../lib/api/supabase'

// // export class RemoteServiceRequestsAdapter implements ServiceRequestsPort {
// //   async getAll(): Promise<ServiceRequest[]> {
// //     console.log('🌐 Fetching service_requests from Supabase...')
    
// //     // Get current user
// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) throw new Error('User not authenticated');

// //     // Filter by guest_id
// //     const { data, error } = await supabase
// //       .from('service_requests')
// //       .select('*')
// //       .eq('guest_id', user.id)  // ← AGREGAR ESTE FILTRO
// //       .order('created_at', { ascending: false })

// //     if (error) {
// //       console.error('❌ Error fetching requests:', error);
// //       throw error;
// //     }
    
// //     console.log('✅ Fetched requests:', data);
// //     return data as ServiceRequest[]
// //   }

// //   async getById(id: string): Promise<ServiceRequest> {
// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) throw new Error('User not authenticated');

// //     const { data, error } = await supabase
// //       .from('service_requests')
// //       .select('*')
// //       .eq('id', id)
// //       .eq('guest_id', user.id)  // ← AGREGAR ESTE FILTRO
// //       .single()

// //     if (error) throw error
// //     return data as ServiceRequest
// //   }

// //   async create(request: CreateRequestDTO): Promise<ServiceRequest> {
// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) throw new Error('User not authenticated');

// //     // Get guest info
// //     const { data: guestData } = await supabase
// //       .from('guests')
// //       .select('name, room_number')
// //       .eq('id', user.id)
// //       .single();

// //     // Get property
// //     const { data: propertyData } = await supabase
// //       .from('properties')
// //       .select('id')
// //       .limit(1)
// //       .single();

// //     // Get department based on type
// //     const departmentMap: Record<string, string> = {
// //       'housekeeping': 'HK',
// //       'maintenance': 'MT',
// //       'concierge': 'CO',
// //       'dining': 'FB',
// //       'spa': 'SP',
// //       'tour': 'TO',
// //       'transportation': 'TR',
// //       'general': 'GR'
// //     };

// //     const deptCode = departmentMap[request.type] || 'GR';
    
// //     const { data: deptData } = await supabase
// //       .from('departments')
// //       .select('id')
// //       .eq('code', deptCode)
// //       .single();

// //     const { data, error } = await supabase
// //       .from('service_requests')
// //       .insert({
// //         guest_id: user.id,
// //         guest_name: guestData?.name || 'Guest',
// //         room_number: guestData?.room_number || 'N/A',
// //         type: request.type,
// //         priority: request.priority,
// //         status: 'pending',
// //         title: request.title,
// //         description: request.description,
// //         department_id: deptData?.id,
// //         property_id: propertyData?.id
// //       })
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error('❌ Error creating request:', error);
// //       throw error;
// //     }
    
// //     console.log('✅ Request created:', data);
// //     return data as ServiceRequest
// //   }

// //   async update(id: string, updates: UpdateRequestDTO): Promise<ServiceRequest> {
// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) throw new Error('User not authenticated');

// //     const { data, error } = await supabase
// //       .from('service_requests')
// //       .update(updates)
// //       .eq('id', id)
// //       .eq('guest_id', user.id)  // ← AGREGAR ESTE FILTRO
// //       .select()
// //       .single()

// //     if (error) throw error
// //     return data as ServiceRequest
// //   }

// //   async delete(id: string): Promise<void> {
// //     const { data: { user } } = await supabase.auth.getUser();
// //     if (!user) throw new Error('User not authenticated');

// //     const { error } = await supabase
// //       .from('service_requests')
// //       .delete()
// //       .eq('id', id)
// //       .eq('guest_id', user.id)  // ← AGREGAR ESTE FILTRO

// //     if (error) throw error
// //   }
// // }



// // src/features/service-requests/api/remote.adapter.ts
// import { ServiceRequestsPort } from './port';
// import { ServiceRequest, CreateRequestDTO, UpdateRequestDTO } from './types';
// import { supabase } from '../../../lib/api/supabase';
// import { AuthService, GuestService, DepartmentService, PropertyService } from '../../../lib/services';

// export class RemoteServiceRequestsAdapter implements ServiceRequestsPort {
//   async getAll(): Promise<ServiceRequest[]> {
//     console.log('🌐 Fetching service_requests from Supabase...');
    
//     const userId = await AuthService.getCurrentUserId();

//     const { data, error } = await supabase
//       .from('service_requests')
//       .select('*')
//       .eq('guest_id', userId)
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('❌ Error fetching requests:', error);
//       throw error;
//     }
    
//     console.log('✅ Fetched requests:', data);
//     return data as ServiceRequest[];
//   }

//   async getById(id: string): Promise<ServiceRequest> {
//     const userId = await AuthService.getCurrentUserId();

//     const { data, error } = await supabase
//       .from('service_requests')
//       .select('*')
//       .eq('id', id)
//       .eq('guest_id', userId)
//       .single();

//     if (error) throw error;
//     return data as ServiceRequest;
//   }

//   async create(request: CreateRequestDTO): Promise<ServiceRequest> {
//     // Use services instead of direct queries
//     const userId = await AuthService.getCurrentUserId();
//     const guestInfo = await GuestService.getGuestInfo(userId);
//     const departmentId = await DepartmentService.getDepartmentIdByType(request.type);
//     const propertyId = await PropertyService.getDefaultPropertyId();

//     const { data, error } = await supabase
//       .from('service_requests')
//       .insert({
//         guest_id: userId,
//         guest_name: guestInfo.name,
//         room_number: guestInfo.room_number,
//         type: request.type,
//         priority: request.priority,
//         status: 'pending',
//         title: request.title,
//         description: request.description,
//         department_id: departmentId,
//         property_id: propertyId
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error('❌ Error creating request:', error);
//       throw error;
//     }
    
//     console.log('✅ Request created:', data);
//     return data as ServiceRequest;
//   }

//   async update(id: string, updates: UpdateRequestDTO): Promise<ServiceRequest> {
//     const userId = await AuthService.getCurrentUserId();

//     const { data, error } = await supabase
//       .from('service_requests')
//       .update(updates)
//       .eq('id', id)
//       .eq('guest_id', userId)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as ServiceRequest;
//   }

//   async delete(id: string): Promise<void> {
//     const userId = await AuthService.getCurrentUserId();

//     const { error } = await supabase
//       .from('service_requests')
//       .delete()
//       .eq('id', id)
//       .eq('guest_id', userId);

//     if (error) throw error;
//   }
// }


// src/features/service-requests/api/remote.adapter.ts
import { ServiceRequestsPort } from './port';
import { ServiceRequest, CreateRequestDTO, UpdateRequestDTO } from './types';
import { supabase } from '../../../lib/api/supabase';
import { AuthService, GuestService, DepartmentService, PropertyService } from '../../../lib/services';
import { logger } from '../../../core/utils/logger';

export class RemoteServiceRequestsAdapter implements ServiceRequestsPort {
  // ========== QUERIES ==========

  async getAll(): Promise<ServiceRequest[]> {
    logger.debug('ServiceRequests', '[GUEST] Fetching ALL service_requests (use getByGuest instead)');
    
    const userId = await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('guest_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('ServiceRequests', 'Error fetching requests', { error });
      throw error;
    }

    logger.info('ServiceRequests', 'Fetched requests', { count: data?.length });
    return data as ServiceRequest[];
  }

  async getById(id: string): Promise<ServiceRequest> {
    const userId = await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .eq('guest_id', userId)
      .single();

    if (error) throw error;
    return data as ServiceRequest;
  }

  async getByGuest(guestId: string): Promise<ServiceRequest[]> {
    logger.debug('ServiceRequests', '[GUEST] Fetching requests for guest', { guestId });
    
    // Verify current user matches requested guest
    const currentUserId = await AuthService.getCurrentUserId();
    if (currentUserId !== guestId) {
      throw new Error('Unauthorized: Cannot access other guest requests');
    }

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
    // Guests cannot access department queries
    throw new Error('Unauthorized: Guests cannot access department requests');
  }

  // ========== MUTATIONS ==========

  async create(request: CreateRequestDTO): Promise<ServiceRequest> {
    const userId = await AuthService.getCurrentUserId();
    const guestInfo = await GuestService.getGuestInfo(userId);
    const departmentId = await DepartmentService.getDepartmentIdByType(request.type);
    const propertyId = await PropertyService.getDefaultPropertyId();

    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id: userId,
        guest_name: guestInfo.name,
        room_number: guestInfo.room_number,
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
    const userId = await AuthService.getCurrentUserId();

    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .eq('guest_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as ServiceRequest;
  }

  async updateStatus(id: string, status: string): Promise<ServiceRequest> {
    // Guests cannot update status
    throw new Error('Unauthorized: Guests cannot update request status');
  }

  async assignToStaff(id: string, staffId: string): Promise<ServiceRequest> {
    // Guests cannot assign staff
    throw new Error('Unauthorized: Guests cannot assign staff to requests');
  }

  async rate(id: string, rating: number, feedback?: string): Promise<ServiceRequest> {
    logger.info('ServiceRequests', '[GUEST] Rating request', { id, rating, feedback });
    
    const userId = await AuthService.getCurrentUserId();

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const { data, error } = await supabase
      .from('service_requests')
      .update({
        rating,
        feedback: feedback || null
      })
      .eq('id', id)
      .eq('guest_id', userId)
      .eq('status', 'completed')
      .select()
      .single();

    if (error) {
      logger.error('ServiceRequests', 'Error rating request', { error });
      throw error;
    }

    if (!data) {
      throw new Error('Request not found or not completed');
    }

    logger.info('ServiceRequests', 'Rating submitted successfully');
    return data as ServiceRequest;
  }

  async delete(id: string): Promise<void> {
    const userId = await AuthService.getCurrentUserId();

    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id)
      .eq('guest_id', userId);

    if (error) throw error;
  }
}