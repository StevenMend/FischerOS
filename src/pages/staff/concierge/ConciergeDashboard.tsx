// src/pages/staff/concierge/ConciergeDashboard.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { DepartmentLayout } from '../../../components/staff/DepartmentLayout';
import { useAuth } from '../../../auth/AuthProvider';
import { logger } from '../../../core/utils/logger';
import { useStaffRequests } from '../../../hooks/staff/useStaffRequests';
import RequestCard from '../../../components/staff/RequestCard';
import ProgressCard from '../../../components/staff/ProgressCard';
import CompletedCard from '../../../components/staff/CompletedCard';
import { TourCoordinationWidget } from './widgets/TourCoordinationWidget';
import { TransportationWidget } from './widgets/TransportationWidget';

export default function ConciergeDashboard() {
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

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    await updateStatus(requestId, newStatus);
  };

  // Calculate completed today
  const completedToday = completedRequests.filter(r => {
    const completedDate = new Date(r.completed_at || '').toDateString();
    const today = new Date().toDateString();
    return completedDate === today;
  }).length;

  const renderCard = (request: any, actions: any) => {
    // Render based on status
    if (request.status === 'pending') {
      return (
        <RequestCard
          key={request.id}
          requests={[request]}
          onTakeRequest={actions.onTake ? () => handleTakeRequest(request.id) : undefined}
        />
      );
    }
    
    if (request.status === 'in_progress' || request.status === 'assigned') {
      return (
        <ProgressCard
          key={request.id}
          items={[request]}
          onUpdateStatus={(id, status) => handleUpdateStatus(id, status)}
        />
      );
    }
    
    return (
      <CompletedCard
        key={request.id}
        items={[request]}
        onCollectSatisfaction={(item) => logger.debug('Concierge', 'Collect satisfaction', item)}
      />
    );
  };

  return (
    <DepartmentLayout
      departmentName="Concierge"
      departmentIcon={<Bell className="w-6 h-6 text-white" />}
      departmentColor="indigo"
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
      
      renderCard={renderCard}
      
      sidebarWidgets={
        <>
          <TourCoordinationWidget />
          <TransportationWidget />
        </>
      }
      
      loading={loading}
    />
  );
}