// src/hooks/staff/useStaffModal.ts
import { useState } from 'react';
import { logger } from '../../lib/utils/logger';

interface CompletedItem {
  id: string;
  guest: string;
  request: string;
  completedAt: string;
  satisfaction: number | null;
  handledBy: string;
  duration: string;
  satisfactionCollected: boolean;
  guestFeedback: string | null;
}

export const useStaffModal = () => {
  // Modal States
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showShiftHandover, setShowShiftHandover] = useState(false);
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  
  // Modal Data
  const [selectedCompletedItem, setSelectedCompletedItem] = useState<CompletedItem | null>(null);
  const [handoverNotes, setHandoverNotes] = useState('');

  // Department Dropdown Handlers
  const toggleDepartmentDropdown = () => {
    setShowDepartmentDropdown(!showDepartmentDropdown);
  };

  const closeDepartmentDropdown = () => {
    setShowDepartmentDropdown(false);
  };

  // Shift Handover Handlers
  const openShiftHandover = () => {
    setShowShiftHandover(true);
  };

  const closeShiftHandover = () => {
    setShowShiftHandover(false);
    setHandoverNotes('');
  };

  const updateHandoverNotes = (notes: string) => {
    setHandoverNotes(notes);
  };

  const submitHandover = async () => {
    /**
     * MOCK IMPLEMENTATION - Replace with actual API call when backend is ready
     * Expected API: POST /api/staff/handover
     * Payload: { notes: string, timestamp: string, staffId: string }
     */
    logger.info('StaffModal', 'Submitting shift handover', { notes: handoverNotes });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    closeShiftHandover();
    return Promise.resolve({ success: true });
  };

  // Satisfaction Modal Handlers
  const openSatisfactionModal = (item: CompletedItem) => {
    setSelectedCompletedItem(item);
    setShowSatisfactionModal(true);
  };

  const closeSatisfactionModal = () => {
    setShowSatisfactionModal(false);
    setSelectedCompletedItem(null);
  };

  const submitSatisfactionFeedback = async (rating: number, feedback: string) => {
    if (!selectedCompletedItem) return;

    /**
     * MOCK IMPLEMENTATION - Replace with actual API call when backend is ready
     * Expected API: POST /api/staff/satisfaction/:requestId
     * Payload: { rating: number, feedback: string, staffId: string }
     */
    logger.info('StaffModal', 'Submitting satisfaction feedback', {
      requestId: selectedCompletedItem.id,
      rating,
      feedback
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    closeSatisfactionModal();
    return Promise.resolve({ success: true });
  };

  // Close all modals (useful for escape key handler)
  const closeAllModals = () => {
    setShowDepartmentDropdown(false);
    setShowShiftHandover(false);
    setShowSatisfactionModal(false);
    setSelectedCompletedItem(null);
  };

  return {
    // States
    showDepartmentDropdown,
    showShiftHandover,
    showSatisfactionModal,
    selectedCompletedItem,
    handoverNotes,
    
    // Handlers
    toggleDepartmentDropdown,
    closeDepartmentDropdown,
    openShiftHandover,
    closeShiftHandover,
    updateHandoverNotes,
    submitHandover,
    openSatisfactionModal,
    closeSatisfactionModal,
    submitSatisfactionFeedback,
    closeAllModals,
  };
};
