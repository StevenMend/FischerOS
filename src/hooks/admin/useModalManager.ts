import { useState, useCallback } from 'react';

interface ModalState {
  staff: any | null;
  partner: any | null;
  expandedChart: string | null;
}

export const useModalManager = () => {
  const [modals, setModals] = useState<ModalState>({
    staff: null,
    partner: null,
    expandedChart: null,
  });

  const openStaffModal = useCallback((staffMember: any) => {
    setModals(prev => ({ ...prev, staff: staffMember }));
  }, []);

  const openPartnerModal = useCallback((partner: any) => {
    setModals(prev => ({ ...prev, partner }));
  }, []);

  const toggleExpandedChart = useCallback((chartType: string) => {
    setModals(prev => ({
      ...prev,
      expandedChart: prev.expandedChart === chartType ? null : chartType
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      staff: null,
      partner: null,
      expandedChart: null,
    });
  }, []);

  const closeStaffModal = useCallback(() => {
    setModals(prev => ({ ...prev, staff: null }));
  }, []);

  const closePartnerModal = useCallback(() => {
    setModals(prev => ({ ...prev, partner: null }));
  }, []);

  return {
    modals,
    actions: {
      openStaffModal,
      openPartnerModal,
      toggleExpandedChart,
      closeAllModals,
      closeStaffModal,
      closePartnerModal,
    },
  };
};