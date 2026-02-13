// src/pages/staff/StaffConsole.tsx - UPDATED TO USE REAL DATA
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import { useStaffRequests } from '../../hooks/staff/useStaffRequests';
import { logger } from '../../core/utils/logger';
import { useStaffModal } from '../../hooks/staff/useStaffModal';
import { StaffModals } from '../../components/staff/StaffModals';
import { ToastService } from '../../lib/services/toast.service';
import RequestCard from '../../components/staff/RequestCard';
import ProgressCard from '../../components/staff/ProgressCard';
import CompletedCard from '../../components/staff/CompletedCard';
import MetricsWidget from '../../components/staff/MetricsWidget';

type TabType = 'pending' | 'progress' | 'completed';

export default function StaffConsole() {
  logger.debug('StaffConsole', 'Rendering');

  const [activeTab, setActiveTab] = useState<TabType>('pending');
  
  const {
    pendingRequests,
    inProgressRequests,
    completedRequests,
    allRequests,
    loading,
    error,
    takeRequest,
    updateStatus,
    loadMoreCompleted,
    hasMoreCompleted,
    myDepartmentName
  } = useStaffRequests();

  const {
    showShiftHandover,
    handoverNotes,
    openShiftHandover,
    closeShiftHandover,
    updateHandoverNotes,
    submitHandover,
    showSatisfactionModal,
    selectedCompletedItem,
    openSatisfactionModal,
    closeSatisfactionModal,
    submitSatisfactionFeedback
  } = useStaffModal();

  logger.debug('StaffConsole', 'State', {
    pending: pendingRequests.length,
    inProgress: inProgressRequests.length,
    completed: completedRequests.length,
    total: allRequests.length,
    department: myDepartmentName,
    loading,
    error
  });

  // Handle take request
  const handleTakeRequest = async (requestId: string) => {
    try {
      logger.debug('StaffConsole', 'Taking request', requestId);
      await takeRequest(requestId);
      logger.info('StaffConsole', 'Request taken', requestId);
    } catch (error) {
      logger.error('StaffConsole', 'Failed to take request', error);
      ToastService.error('Request Error', 'Failed to take request');
    }
  };

  // Handle update status
  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      logger.debug('StaffConsole', 'Updating status', { requestId, newStatus });
      await updateStatus(requestId, newStatus);
      logger.info('StaffConsole', 'Status updated', { requestId, newStatus });
    } catch (error) {
      logger.error('StaffConsole', 'Failed to update status', error);
      ToastService.error('Request Error', 'Failed to take request');
    }
  };

  if (loading) {
    logger.debug('StaffConsole', 'Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading requests...</p>
          <p className="text-gray-500 text-sm mt-2">Setting up your console</p>
        </div>
      </div>
    );
  }

  if (error) {
    logger.error('StaffConsole', 'Error state', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-xl mb-2 text-center">Error Loading Requests</h3>
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Department Badge */}
      {myDepartmentName && (
        <div className="bg-gradient-to-r from-blue-500 to-green-500 border-b border-blue-600 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-semibold">
              <span className="opacity-90">Department:</span> {myDepartmentName}
            </p>
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white font-bold">Live</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tabs */}
      <nav className="lg:hidden sticky top-16 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div className="w-full px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                logger.debug('StaffConsole', 'Switching to pending tab');
                setActiveTab('pending');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                activeTab === 'pending'
                  ? 'bg-red-50 text-red-700 border-2 border-red-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Pending</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'pending' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {pendingRequests.length}
              </span>
            </button>

            <button
              onClick={() => {
                logger.debug('StaffConsole', 'Switching to progress tab');
                setActiveTab('progress');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                activeTab === 'progress'
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Active</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {inProgressRequests.length}
              </span>
            </button>

            <button
              onClick={() => {
                logger.debug('StaffConsole', 'Switching to completed tab');
                setActiveTab('completed');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                activeTab === 'completed'
                  ? 'bg-green-50 text-green-700 border-2 border-green-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Done</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {completedRequests.length}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full pt-4 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
        
        {/* Mobile View */}
        <div className="lg:hidden px-4 pb-6 space-y-4">
          {/* Metrics Widget - Mobile */}
          <MetricsWidget allRequests={allRequests} />
          
          {/* Content based on active tab */}
          {activeTab === 'pending' && (
            <RequestCard 
              requests={pendingRequests} 
              onTakeRequest={handleTakeRequest} 
            />
          )}
          
          {activeTab === 'progress' && (
            <ProgressCard 
              items={inProgressRequests} 
              onUpdateStatus={handleUpdateStatus} 
            />
          )}
          
          {activeTab === 'completed' && (
            <>
              <CompletedCard 
                items={completedRequests} 
                onCollectSatisfaction={openSatisfactionModal} 
              />
              
              {hasMoreCompleted && (
                <button
                  onClick={() => {
                    logger.debug('StaffConsole', 'Loading more completed (mobile)');
                    loadMoreCompleted();
                  }}
                  className="w-full mt-4 py-3 px-4 bg-white border-2 border-green-200 rounded-xl text-green-700 font-semibold hover:bg-green-50 transition-all shadow-sm"
                >
                  Load More Completed
                </button>
              )}
            </>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block w-full min-h-[calc(100vh-64px)] px-6 pb-6">
          {/* Metrics Widget - Desktop (Top) */}
          <div className="max-w-[2000px] mx-auto mb-6">
            <MetricsWidget allRequests={allRequests} />
          </div>
          
          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-6 max-w-[2000px] mx-auto">
            
            {/* Pending Column */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Pending</h2>
                </div>
                <div className="bg-red-50 text-red-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-red-200 shadow-sm">
                  {pendingRequests.length}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                <RequestCard 
                  requests={pendingRequests} 
                  onTakeRequest={handleTakeRequest} 
                />
              </div>
            </section>

            {/* In Progress Column */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">In Progress</h2>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-blue-200 shadow-sm">
                  {inProgressRequests.length}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                <ProgressCard 
                  items={inProgressRequests} 
                  onUpdateStatus={handleUpdateStatus} 
                />
              </div>
            </section>

            {/* Completed Column */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Completed</h2>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-green-200 shadow-sm">
                  {completedRequests.length}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                <CompletedCard 
                  items={completedRequests} 
                  onCollectSatisfaction={openSatisfactionModal} 
                />
                
                {hasMoreCompleted && (
                  <button
                    onClick={() => {
                      logger.debug('StaffConsole', 'Loading more completed (desktop)');
                      loadMoreCompleted();
                    }}
                    className="w-full py-3 px-4 bg-white border-2 border-green-200 rounded-xl text-green-700 font-semibold hover:bg-green-50 transition-all shadow-sm"
                  >
                    Load More Completed
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Add custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <StaffModals
        showShiftHandover={showShiftHandover}
        handoverNotes={handoverNotes}
        onCloseShiftHandover={closeShiftHandover}
        onUpdateHandoverNotes={updateHandoverNotes}
        onSubmitHandover={submitHandover}
        showSatisfactionModal={showSatisfactionModal}
        selectedCompletedItem={selectedCompletedItem}
        onCloseSatisfactionModal={closeSatisfactionModal}
        onSubmitSatisfaction={submitSatisfactionFeedback}
      />
    </>
  );
}

