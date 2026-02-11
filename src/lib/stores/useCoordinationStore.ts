// src/lib/stores/useCoordinationStore.ts - Simplified Version (No RealtimeAPI)
import { create } from 'zustand';
import {
  CoordinationEvent,
  LiveUpdate,
  BroadcastMessage
} from '../../types';
// REMOVED: import { realtimeAPI } from "../api/realtime"; // This was causing crashes

interface CoordinationState {
  // WebSocket Connection
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  
  // Live Updates
  liveUpdates: LiveUpdate[];
  unreadUpdatesCount: number;
  
  // Broadcast Messages
  broadcasts: BroadcastMessage[];
  unreadBroadcastsCount: number;
  
  // Coordination Events
  events: CoordinationEvent[];
  
  // UI State
  error: string | null;
  
  // Actions
  connect: (userId: string, userType: string, authToken: string) => Promise<void>;
  disconnect: () => void;
  sendEvent: (eventType: string, data: any, target?: string[]) => void;
  sendBroadcast: (message: BroadcastMessage) => void;
  markUpdateRead: (updateId: string) => void;
  markBroadcastRead: (broadcastId: string) => void;
  clearAllUpdates: () => void;
  subscribe: (eventType: string, callback: (data: any) => void) => () => void;
  clearError: () => void;
}

export const useCoordinationStore = create<CoordinationState>((set, get) => ({
  // Initial State
  isConnected: false,
  connectionStatus: 'disconnected',
  
  liveUpdates: [],
  unreadUpdatesCount: 0,
  
  broadcasts: [],
  unreadBroadcastsCount: 0,
  
  events: [],
  error: null,

  // Connect to WebSocket (SIMPLIFIED - no actual connection)
  connect: async (userId, userType, authToken) => {
    console.log('🟡 Mock coordination connect:', userId, userType);
    set({ connectionStatus: 'connecting', error: null });
    
    // Simulate connection success after brief delay
    setTimeout(() => {
      set({ 
        isConnected: true, 
        connectionStatus: 'connected' 
      });
    }, 100);
  },

  // Disconnect WebSocket
  disconnect: () => {
    console.log('🟡 Mock coordination disconnect');
    set({ 
      isConnected: false, 
      connectionStatus: 'disconnected' 
    });
  },

  // Send Event (MOCK)
  sendEvent: (eventType, data, target) => {
    console.log('🟡 Mock sendEvent:', eventType, data, target);
    if (!get().isConnected) {
      set({ error: 'Not connected to real-time service' });
    }
  },

  // Send Broadcast (MOCK)
  sendBroadcast: (message) => {
    console.log('🟡 Mock sendBroadcast:', message);
    if (get().isConnected) {
      // Add to local state
      set({
        broadcasts: [message, ...get().broadcasts]
      });
    } else {
      set({ error: 'Not connected to real-time service' });
    }
  },

  // Mark Update Read
  markUpdateRead: (updateId) => {
    const updates = get().liveUpdates.map(update =>
      update.id === updateId ? { ...update, status: 'acknowledged' } : update
    );
    
    const unreadCount = updates.filter(u => u.status === 'new').length;
    
    set({
      liveUpdates: updates,
      unreadUpdatesCount: unreadCount
    });
  },

  // Mark Broadcast Read
  markBroadcastRead: (broadcastId) => {
    const broadcasts = get().broadcasts.map(broadcast =>
      broadcast.id === broadcastId 
        ? { ...broadcast, acknowledged: [...broadcast.acknowledged, 'current-user'] }
        : broadcast
    );
    
    set({
      broadcasts,
      unreadBroadcastsCount: Math.max(0, get().unreadBroadcastsCount - 1)
    });
  },

  // Clear All Updates
  clearAllUpdates: () => {
    set({
      liveUpdates: [],
      unreadUpdatesCount: 0
    });
  },

  // Subscribe to Event (MOCK)
  subscribe: (eventType, callback) => {
    console.log('🟡 Mock subscribe:', eventType);
    // Return unsubscribe function
    return () => console.log('🟡 Mock unsubscribe:', eventType);
  },

  // Clear Error
  clearError: () => set({ error: null })
}));