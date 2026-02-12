// src/types/auth.ts
import { UserRole } from './index';

export interface AuthCredentials {
  type: UserRole;
  sessionTimeout: string;
}

export interface GuestCredentials extends AuthCredentials {
  roomNumber?: string;
  confirmationCode?: string;
  property: string;
}

export interface StaffCredentials extends AuthCredentials {
  staffId: string;
  department: string;
  password: string;
  property: string;
}

export interface AdminCredentials extends AuthCredentials {
  adminEmail: string;
  adminPassword: string;
  property: string;
}

export interface AuthSession {
  user: UserSession;
  token: string;
  expiresAt: string;
  permissions: Permission[];
}

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  restaurantSlug?: string;
  room?: string;
  property: string;
  avatar?: string;
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete')[];
  scope: 'own' | 'department' | 'all';
}
