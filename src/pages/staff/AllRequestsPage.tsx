

// src/pages/staff/AllRequestsPage.tsx
import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, User, MapPin, Package } from 'lucide-react';
import { useServiceRequests } from '../../features/service-requests/hooks/useServiceRequests';
import type { RequestStatus } from '../../features/service-requests/api';
import { logger } from '../../core/utils/logger';

export default function AllRequestsPage() {
  const {
    filteredRequests,
    selectedStatus,
    setSelectedStatus,
    updateRequest,
    loadMoreCompleted,      // ✅ NUEVO
    hasMoreCompleted,       // ✅ NUEVO
    loading,
    error
  } = useServiceRequests();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'assigned': return <User className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    setUpdatingId(id);
    try {
      await updateRequest(id, { 
        status: newStatus,
        ...(newStatus === 'completed' ? { completed_at: new Date().toISOString() } : {})
      });
    } catch (error) {
      logger.error('Requests', 'Failed to update status', error);
      alert('Failed to update request status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <p className="text-xl font-semibold text-red-700 mb-2">Error loading requests</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark p-6 lg:p-8">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-display">Service Requests</h1>
              <p className="text-foreground/70">{filteredRequests.length} active requests • Staff Operations</p>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-md ${
              selectedStatus === 'all'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                : 'bg-white text-foreground border-2 border-surface-dark hover:shadow-lg hover:scale-105'
            }`}
          >
            All Requests
          </button>
          {(['pending', 'assigned', 'in-progress', 'completed'] as RequestStatus[]).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-md ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                  : 'bg-white text-foreground border-2 border-surface-dark hover:shadow-lg hover:scale-105'
              }`}
            >
              {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Requests Grid */}
        <div className="grid gap-6">
          {filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border-2 border-surface hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  {/* Title & Status */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center flex-shrink-0">
                      {getStatusIcon(request.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{request.title}</h3>
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          request.priority === 'urgent' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                          request.priority === 'high' ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' :
                          request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                          'bg-gray-100 text-gray-700 border-2 border-gray-300'
                        }`}>
                          {request.priority.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-primary/10 text-primary border-2 border-primary/20">
                          {request.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </div>

                      {/* Guest Info */}
                      <div className="flex items-center flex-wrap gap-4 text-sm text-foreground/80 mb-3">
                        <span className="flex items-center font-medium">
                          <User className="w-4 h-4 mr-1.5 text-primary" />
                          {request.guest_name}
                        </span>
                        <span className="flex items-center font-medium">
                          <MapPin className="w-4 h-4 mr-1.5 text-accent" />
                          Room {request.room_number}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-foreground/90 mb-3 leading-relaxed">{request.description}</p>

                      {/* Assigned Staff */}
                      {request.assigned_to_name && (
                        <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-xl mb-3">
                          <User className="w-4 h-4 mr-2 text-primary" />
                          <span className="text-sm font-semibold text-primary">
                            Assigned to: {request.assigned_to_name}
                          </span>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-foreground/60 font-medium">
                        Created {new Date(request.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Update Dropdown */}
                <div className="lg:ml-4 flex-shrink-0">
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(request.id, e.target.value as RequestStatus)}
                    disabled={updatingId === request.id}
                    className="w-full lg:w-auto px-4 py-3 bg-white border-2 border-surface-dark rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="assigned">👤 Assigned</option>
                    <option value="in-progress">⚡ In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ NUEVO: Load More Button - Solo aparece cuando hay más completed y el filtro es "completed" o "all" */}
        {hasMoreCompleted && (selectedStatus === 'completed' || selectedStatus === 'all') && filteredRequests.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMoreCompleted}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Load More Completed Requests
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-foreground/30" />
            </div>
            <p className="text-xl font-semibold text-foreground/70">No requests found</p>
            <p className="text-sm text-foreground/50 mt-2">All clear for this filter!</p>
          </div>
        )}
      </div>
    </div>
  );
}