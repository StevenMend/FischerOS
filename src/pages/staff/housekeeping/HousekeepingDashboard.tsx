// src/pages/staff/housekeeping/HousekeepingDashboard.tsx
import { Home } from 'lucide-react';
import { DepartmentLayout } from '../../../components/staff/DepartmentLayout';
import { useAuth } from '../../../auth/AuthProvider';
import { useStaffRequests } from '../../../hooks/staff/useStaffRequests';
import { logger } from '../../../core/utils/logger';
import RequestCard from '../../../components/staff/RequestCard';
import ProgressCard from '../../../components/staff/ProgressCard';
import CompletedCard from '../../../components/staff/CompletedCard';
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
        onCollectSatisfaction={(item) =>
          logger.debug('Housekeeping', 'Collect satisfaction', item)
        }
      />
    );
  };

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
        avgTime: '15min',
      }}
      pendingItems={pendingRequests}
      inProgressItems={inProgressRequests}
      completedItems={completedRequests}
      renderCard={renderCard}
      sidebarWidgets={
        <>
          <RoomStatusWidget />
          <InventoryWidget
            onQuickRequest={(item) =>
              logger.debug('Housekeeping', 'Quick request', item)
            }
          />
        </>
      }
      loading={loading}
    />
  );
}