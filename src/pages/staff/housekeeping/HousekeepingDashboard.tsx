// src/pages/staff/housekeeping/HousekeepingDashboard.tsx
import React from 'react';
import { Home } from 'lucide-react';
import { DepartmentLayout } from '../../../components/staff/DepartmentLayout';
import { useAuth } from '../../../auth/AuthProvider';
import { useStaffRequests } from '../../../hooks/staff/useStaffRequests';
import { logger } from '../../../core/utils/logger';
import RequestCard from '../../../components/staff/RequestCard';
import { RoomStatusWidget } from './widgets/RoomStatusWidget';
import { InventoryWidget } from './widgets/InventoryWidget';

export default function HousekeepingDashboard() {
  const { user } = useAuth();
  const {
    pendingRequests,
    inProgressRequests,
    completedRequests,
    loading,
    takeRequest,
    updateStatus
  } = useStaffRequests();

  const handleTakeRequest = async (requestId: string) => {
    await takeRequest(requestId);
  };

  const handleComplete = async (requestId: string) => {
    await updateStatus(requestId, 'completed');
  };

  // Calculate completed today
  const completedToday = completedRequests.filter(r => {
    const completedDate = new Date(r.completed_at || '').toDateString();
    const today = new Date().toDateString();
    return completedDate === today;
  }).length;

  return (
    <DepartmentLayout
      departmentName="Housekeeping"
      departmentIcon={<Home className="w-6 h-6 text-white" />}
      departmentColor="green"
      staffName={user?.name || 'Staff'}
      
      metrics={{
        pending: pendingRequests.length,
        inProgress: inProgressRequests.length,
        completedToday,
        avgTime: '15min'
      }}
      
      pendingItems={pendingRequests}
      inProgressItems={inProgressRequests}
      completedItems={completedRequests}
      
      renderCard={(request, actions) => (
        <RequestCard
          key={request.id}
          requests={[request]}
          onTakeRequest={actions.onTake ? () => handleTakeRequest(request.id) : undefined}
        />
      )}
      
      sidebarWidgets={
        <>
          <RoomStatusWidget />
          <InventoryWidget onQuickRequest={(item) => logger.debug('Housekeeping', 'Quick request', item)} />
        </>
      }
      
      loading={loading}
    />
  );
}