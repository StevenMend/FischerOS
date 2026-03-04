// src/features/service-requests/api/types.ts
export type RequestType = 
  | 'housekeeping' 
  | 'transportation' 
  | 'concierge' 
  | 'maintenance' 
  | 'dining' 
  | 'spa' 
  | 'tour'
  | 'general';

export type RequestStatus = 
  | 'pending' 
  | 'assigned' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled';

export type RequestPriority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'urgent';

// ✅ FIXED: Usar snake_case para match con Supabase
export interface ServiceRequest {
  id: string;
  guest_id: string;           // ✅ snake_case
  guest_name: string;         // ✅ snake_case
  room_number: string;        // ✅ snake_case
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  title: string;
  description: string;
  location?: string;
  assigned_to?: string;       // ✅ snake_case
  assigned_to_name?: string;  // ✅ snake_case
  department_id?: string;     // ✅ NUEVO
  property_id?: string;       // ✅ NUEVO
  created_at: string;         // ✅ snake_case
  updated_at: string;         // ✅ snake_case
  completed_at?: string;      // ✅ snake_case
  acknowledged_at?: string;   // ✅ NUEVO
  started_at?: string;        // ✅ NUEVO
  scheduled_for?: string;     // ✅ snake_case
  notes?: string[];
  related_booking_id?: string; // ✅ snake_case
  rating?: number;            // ✅ NUEVO
  feedback?: string;          // ✅ NUEVO
  metadata?: Record<string, any>;
}

export interface CreateRequestDTO {
  type: RequestType;
  priority: RequestPriority;
  title: string;
  description: string;
  location?: string;
  scheduled_for?: string;     // ✅ snake_case
  metadata?: Record<string, any>;
}

export interface UpdateRequestDTO {
  status?: RequestStatus;
  priority?: RequestPriority;
  assigned_to?: string;       // ✅ snake_case
  assigned_to_name?: string;  // ✅ NUEVO
  notes?: string;
  completed_at?: string;      // ✅ snake_case
  acknowledged_at?: string;   // ✅ NUEVO
  started_at?: string;        // ✅ NUEVO
}