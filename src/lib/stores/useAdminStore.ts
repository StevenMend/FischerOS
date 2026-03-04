
// src/lib/stores/useAdminStore.ts - Admin Analytics State Management
import { create } from 'zustand';
import { 
  KPI, 
  ResortHeatMapArea, 
  DepartmentStatus, 
  RevenueBreakdown,
  StaffMember,
  Partner 
} from '../../types';
import { adminAPI } from '../api';

interface AdminState {
  // KPIs and Analytics
  kpis: KPI[];
  resortHeatMap: ResortHeatMapArea[];
  departmentStatus: DepartmentStatus[];
  revenueBreakdown: RevenueBreakdown[];
  
  // Staff and Partners
  staffPerformance: StaffMember[];
  partnerPerformance: Partner[];
  
  // Filters
  selectedTimeframe: string;
  selectedDepartment: string;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Constants
  timeframes: string[];
  departments: string[];
  
  // Actions
  loadKPIs: () => Promise<void>;
  loadResortHeatMap: () => Promise<void>;
  loadDepartmentStatus: () => Promise<void>;
  loadRevenueBreakdown: () => Promise<void>;
  loadStaffPerformance: () => Promise<void>;
  loadPartnerPerformance: () => Promise<void>;
  
  setTimeframe: (timeframe: string) => void;
  setDepartment: (department: string) => void;
  
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => Promise<void>;
  updatePartner: (id: string, updates: Partial<Partner>) => Promise<void>;
  
  refreshAllData: () => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial State
  kpis: [],
  resortHeatMap: [],
  departmentStatus: [],
  revenueBreakdown: [],
  staffPerformance: [],
  partnerPerformance: [],
  
  selectedTimeframe: 'Today',
  selectedDepartment: 'All',
  
  loading: false,
  error: null,
  
  timeframes: ['Today', 'Week', 'Month', 'Quarter'],
  departments: ['All', 'Tours', 'Restaurants', 'Spa', 'Front Desk'],

  // Load KPIs
  loadKPIs: async () => {
    set({ loading: true, error: null });
    
    try {
      const { selectedTimeframe, selectedDepartment } = get();
      const kpis = await adminAPI.getKPIs(selectedTimeframe, selectedDepartment);
      set({ kpis, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load KPIs',
        loading: false 
      });
    }
  },

  // Load Resort Heat Map
  loadResortHeatMap: async () => {
    try {
      const { selectedTimeframe } = get();
      const resortHeatMap = await adminAPI.getResortHeatMap(selectedTimeframe);
      set({ resortHeatMap });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load heat map'
      });
    }
  },

  // Load Department Status
  loadDepartmentStatus: async () => {
    try {
      const { selectedDepartment } = get();
      const departmentStatus = await adminAPI.getDepartmentStatus(selectedDepartment);
      set({ departmentStatus });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load department status'
      });
    }
  },

  // Load Revenue Breakdown
  loadRevenueBreakdown: async () => {
    try {
      const { selectedTimeframe } = get();
      const revenueBreakdown = await adminAPI.getRevenueBreakdown(selectedTimeframe);
      set({ revenueBreakdown });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load revenue data'
      });
    }
  },

  // Load Staff Performance
  loadStaffPerformance: async () => {
    try {
      const { selectedDepartment } = get();
      const staffPerformance = await adminAPI.getStaffPerformance(selectedDepartment);
      set({ staffPerformance });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load staff performance'
      });
    }
  },

  // Load Partner Performance
  loadPartnerPerformance: async () => {
    try {
      const { selectedTimeframe } = get();
      const partnerPerformance = await adminAPI.getPartnerPerformance(selectedTimeframe);
      set({ partnerPerformance });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load partner performance'
      });
    }
  },

  // Set Timeframe
  setTimeframe: (timeframe) => {
    set({ selectedTimeframe: timeframe });
    // Reload relevant data
    get().loadKPIs();
    get().loadResortHeatMap();
    get().loadRevenueBreakdown();
    get().loadPartnerPerformance();
  },

  // Set Department
  setDepartment: (department) => {
    set({ selectedDepartment: department });
    // Reload relevant data
    get().loadKPIs();
    get().loadDepartmentStatus();
    get().loadStaffPerformance();
  },

  // Update Staff Member
  updateStaffMember: async (id, updates) => {
    try {
      const updatedStaff = await adminAPI.updateStaffMember(id, updates);
      
      set({
        staffPerformance: get().staffPerformance.map(staff =>
          staff.id === id ? updatedStaff : staff
        )
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update staff member'
      });
    }
  },

  // Update Partner
  updatePartner: async (id, updates) => {
    try {
      const updatedPartner = await adminAPI.updatePartner(id, updates);
      
      set({
        partnerPerformance: get().partnerPerformance.map(partner =>
          partner.id === id ? updatedPartner : partner
        )
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update partner'
      });
    }
  },

  // Refresh All Data
  refreshAllData: async () => {
    await Promise.all([
      get().loadKPIs(),
      get().loadResortHeatMap(),
      get().loadDepartmentStatus(),
      get().loadRevenueBreakdown(),
      get().loadStaffPerformance(),
      get().loadPartnerPerformance()
    ]);
  },

  // Clear Error
  clearError: () => set({ error: null })
}));