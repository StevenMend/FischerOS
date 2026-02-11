// src/types/admin.ts
import { BaseEntity } from './index';

export interface KPI extends BaseEntity {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  detail: string;
  calculation: string;
  target: number;
  current: number;
  forecast: string;
  benchmark: string;
}

export interface ResortHeatMapArea extends BaseEntity {
  area: string;
  status: 'optimal' | 'attention' | 'crisis';
  load: number;
  issues: number;
  revenue: string;
}

export interface DepartmentStatus extends BaseEntity {
  name: string;
  status: 'optimal' | 'high' | 'normal';
  load: number;
  revenue: string;
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
  alerts: number;
  satisfaction: number;
}

export interface RevenueBreakdown extends BaseEntity {
  service: string;
  revenue: string;
  margin: string;
  upsell: string;
  trend: 'up' | 'down' | 'stable';
  details: string;
  growth: string;
  forecast: string;
  efficiency: number;
}

export interface StaffMember extends BaseEntity {
  name: string;
  department: string;
  rating: number;
  efficiency: number;
  revenue: string;
  streak: number;
  growth: string;
  certifications: string[];
  trainingNeeds: string[];
  schedule: string;
  performance: 'exceptional' | 'excellent' | 'good';
  completed: number;
  avgTime: string;
}

export interface Partner extends BaseEntity {
  name: string;
  status: 'excellent' | 'good';
  tier: 'platinum' | 'gold' | 'silver';
  contractCompliance: number;
  commission: string;
  score: number;
  reliability: number;
  growth: string;
  responseTime: string;
  revenue: string;
  satisfaction: number;
  issues: number;
  paymentStatus: 'current' | 'overdue';
  bookings: number;
}
