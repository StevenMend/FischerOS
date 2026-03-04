// src/features/service-requests/components/GuestRequestCard.tsx - UPDATED FOR UNIFIED ACTIVITIES
import React from 'react';
import { Clock, User, CheckCircle, AlertCircle, Loader, Sparkles, Utensils, Compass, Flower2 } from 'lucide-react';
import type { UnifiedActivity } from '../queries/unified-activities-queries';

interface GuestRequestCardProps {
  request: UnifiedActivity;
  isNew?: boolean;
  onRate?: () => void;
}

const getActivityIcon = (type: string) => {
  const icons = {
    'service_request': AlertCircle,
    'restaurant': Utensils,
    'tour': Compass,
    'spa': Flower2,
  };
  return icons[type as keyof typeof icons] || AlertCircle;
};

const getActivityTypeLabel = (type: string) => {
  const labels = {
    'service_request': 'Service Request',
    'restaurant': 'Restaurant',
    'tour': 'Tour',
    'spa': 'Spa',
  };
  return labels[type as keyof typeof labels] || 'Activity';
};

const getActivityColor = (type: string) => {
  const colors = {
    'service_request': 'text-gray-600 bg-gray-50 border-gray-200',
    'restaurant': 'text-amber-600 bg-amber-50 border-amber-200',
    'tour': 'text-blue-600 bg-blue-50 border-blue-200',
    'spa': 'text-pink-600 bg-pink-50 border-pink-200',
  };
  return colors[type as keyof typeof colors] || colors.service_request;
};

const getStatusConfig = (status: string) => {
  const configs = {
    'pending': {
      label: 'Pending',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: Clock,
      badge: 'bg-yellow-500'
    },
    'assigned': {
      label: 'Assigned',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: User,
      badge: 'bg-blue-500'
    },
    'confirmed': {
      label: 'Confirmed',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: CheckCircle,
      badge: 'bg-blue-500'
    },
    'in-progress': {
      label: 'In Progress',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: Loader,
      badge: 'bg-purple-500'
    },
    'completed': {
      label: 'Completed',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircle,
      badge: 'bg-green-500'
    },
    'cancelled': {
      label: 'Cancelled',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: AlertCircle,
      badge: 'bg-red-500'
    }
  };

  return configs[status as keyof typeof configs] || configs.pending;
};

const getPriorityColor = (priority?: string) => {
  if (!priority) return 'text-gray-600 bg-gray-50 border-gray-200';
  
  const colors = {
    'urgent': 'text-red-600 bg-red-50 border-red-200',
    'high': 'text-orange-600 bg-orange-50 border-orange-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'low': 'text-green-600 bg-green-50 border-green-200'
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

const calculateElapsedTime = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export default function GuestRequestCard({ request, isNew, onRate }: GuestRequestCardProps) {
  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;
  const ActivityIcon = getActivityIcon(request.type);
  const elapsed = calculateElapsedTime(request.created_at);

  return (
    <div className={`relative bg-white rounded-2xl p-4 border-2 ${statusConfig.border} shadow-md hover:shadow-lg transition-all duration-300`}>
      {/* NEW Badge */}
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1 animate-pulse">
          <Sparkles className="w-3 h-3" />
          <span>NEW</span>
        </div>
      )}

      {/* Header: Type + Status + Priority */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* Activity Type Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${getActivityColor(request.type)}`}>
            <ActivityIcon className="w-3.5 h-3.5" />
            <span>{getActivityTypeLabel(request.type)}</span>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.text}`} />
            <span className={`text-xs font-bold ${statusConfig.text}`}>{statusConfig.label}</span>
          </div>
        </div>

        {/* Priority (only for service requests) */}
        {request.metadata.priority && (
          <div className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(request.metadata.priority)}`}>
            {request.metadata.priority.toUpperCase()}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2">{request.title}</h3>

      {/* Description */}
      {request.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>
      )}

      {/* Type-specific metadata */}
      <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
        {/* Restaurant metadata */}
        {request.type === 'restaurant' && (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Restaurant:</span>
              <span className="font-medium text-gray-700">{request.metadata.restaurant_name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Date & Time:</span>
              <span className="font-medium text-gray-700">
                {request.metadata.reservation_date} at {request.metadata.time_slot}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Party Size:</span>
              <span className="font-medium text-gray-700">{request.metadata.party_size} guests</span>
            </div>
          </>
        )}

        {/* Tour metadata */}
        {request.type === 'tour' && (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Tour:</span>
              <span className="font-medium text-gray-700">{request.metadata.tour_name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium text-gray-700">{request.metadata.booking_date}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Participants:</span>
              <span className="font-medium text-gray-700">
                {request.metadata.adults} adults {request.metadata.children ? `+ ${request.metadata.children} children` : ''}
              </span>
            </div>
          </>
        )}

        {/* Spa metadata */}
        {request.type === 'spa' && (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Treatment:</span>
              <span className="font-medium text-gray-700">{request.metadata.treatment_name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Date & Time:</span>
              <span className="font-medium text-gray-700">
                {request.metadata.appointment_date} at {request.metadata.time_slot}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Guests:</span>
              <span className="font-medium text-gray-700">{request.metadata.guests}</span>
            </div>
          </>
        )}

        {/* Service Request metadata */}
        {request.type === 'service_request' && (
          <>
            {request.metadata.department && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium text-gray-700">{request.metadata.department}</span>
              </div>
            )}
            {request.metadata.assigned_to && (
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Assigned to <span className="font-bold">{request.metadata.assigned_to}</span>
                </span>
              </div>
            )}
          </>
        )}

        {/* Created time */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
          <span className="text-gray-500">Created:</span>
          <span className="font-medium text-gray-700">{elapsed}</span>
        </div>
      </div>

      {/* Actions */}
      {request.status === 'completed' && !request.rating && onRate && (
        <button
          onClick={onRate}
          className="w-full bg-gradient-to-r from-[#8B6F47] to-[#6B5537] hover:from-[#6B5537] hover:to-[#8B6F47] text-white py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Rate Experience</span>
        </button>
      )}

      {request.rating && (
        <div className="flex items-center justify-center space-x-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <span className="text-yellow-500 text-lg">⭐</span>
          <span className="text-sm font-bold text-gray-900">You rated: {request.rating}/5</span>
        </div>
      )}
    </div>
  );
}
