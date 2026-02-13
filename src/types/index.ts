// src/types/index.ts - Global shared types

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'guest' | 'staff' | 'admin';

// Domain type modules
export * from './admin';
export * from './auth';
