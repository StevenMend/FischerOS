// src/pages/staff/transportation/TransportationDashboard.tsx
import { Car } from 'lucide-react';
import { DepartmentLayout } from '../../../components/staff/DepartmentLayout';
import { useAuth } from '../../../auth/AuthProvider';
import { useStaffRequests } from '../../../hooks/staff/useStaffRequests';
import { logger } from '../../../core/utils/logger';
import RequestCard from '../../../components/staff/RequestCard';
import ProgressCard from '../../../components/staff/ProgressCard';
import CompletedCard from '../../../components/staff/CompletedCard';

export default function TransportationDashboard() {
  const { user } = useAuth();

  const {
    pendingRequests,
    inProgressRequests,
    completedRequests,
    loading,
    takeRequest,
    updateStatus,
  } = useStaffRequests();

  const handleTakeRequest = async (requestId: string) => {
    await takeRequest(requestId);
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    await updateStatus(requestId, newStatus);
  };

  const completedToday = completedRequests.filter((r) => {
    const completedDate = new Date(r.completed_at || '').toDateString();
    const today = new Date().toDateString();
    return completedDate === today;
  }).length;

  const renderCard = (request: any) => {
    if (request.status === 'pending') {
      return (
        <RequestCard
          key={request.id}
          requests={[request]}
          onTakeRequest={() => handleTakeRequest(request.id)}
        />
      );
    }

    if (request.status === 'in-progress' || request.status === 'assigned') {
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
        onCollectSatisfaction={(item) =>
          logger.debug('Transportation', 'Collect satisfaction', item)
        }
      />
    );
  };

  return (
    <DepartmentLayout
      departmentName="Transportation"
      departmentIcon={<Car className="w-6 h-6 text-white" />}
      departmentColor="teal"
      staffName={user?.name || 'Staff'}
      metrics={{
        pending: pendingRequests.length,
        inProgress: inProgressRequests.length,
        completedToday,
        avgTime: '20min',
      }}
      pendingItems={pendingRequests}
      inProgressItems={inProgressRequests}
      completedItems={completedRequests}
      renderCard={renderCard}
      loading={loading}
    />
  );
}
