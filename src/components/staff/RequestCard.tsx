// src/components/staff/RequestCard.tsx - PRO VERSION WITH REAL DB DATA
import React from 'react';
import { Timer, Crown, Zap, AlertTriangle, User, MapPin, Clock } from 'lucide-react';
import { logger } from '../../core/utils/logger';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  guest_id: string;
  guest_name: string;
  room_number: string;
  created_at: string;
  acknowledged_at: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
}

interface RequestCardProps {
  requests: ServiceRequest[];
  onTakeRequest: (requestId: string) => void;
}

const calculateElapsedTime = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ${diffHours % 24}h`;
};

const getPriorityConfig = (priority: string) => {
  const configs = {
    urgent: { 
      bg: 'bg-red-500', 
      border: 'border-red-300',
      cardBg: 'bg-red-50/50',
      icon: Zap,
      text: 'text-red-700'
    },
    high: { 
      bg: 'bg-orange-500', 
      border: 'border-orange-300',
      cardBg: 'bg-orange-50/50',
      icon: AlertTriangle,
      text: 'text-orange-700'
    },
    medium: { 
      bg: 'bg-yellow-400', 
      border: 'border-yellow-300',
      cardBg: 'bg-yellow-50/50',
      icon: null,
      text: 'text-yellow-700'
    },
    low: { 
      bg: 'bg-green-400', 
      border: 'border-green-300',
      cardBg: 'bg-green-50/50',
      icon: null,
      text: 'text-green-700'
    },
    vip: { 
      bg: 'bg-purple-500', 
      border: 'border-purple-300',
      cardBg: 'bg-purple-50/50',
      icon: Crown,
      text: 'text-purple-700'
    }
  };
  
  return configs[priority as keyof typeof configs] || configs.medium;
};

export default function RequestCard({ requests, onTakeRequest }: RequestCardProps) {
  logger.debug('RequestCard', 'render', { count: requests.length });

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No pending requests</p>
        <p className="text-gray-400 text-sm mt-1">All caught up! 🎉</p>
      </div>
    );
  }

  // Sort by priority (urgent > high > medium > low)
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1, vip: 5 };
  const sortedRequests = [...requests].sort((a, b) => {
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    return bPriority - aPriority;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {sortedRequests.map((request) => {
        const config = getPriorityConfig(request.priority);
        const Icon = config.icon;
        const elapsed = calculateElapsedTime(request.created_at);
        
        logger.debug('RequestCard', 'Rendering card', {
          id: request.id,
          title: request.title,
          priority: request.priority,
          elapsed
        });
        
        return (
          <div 
            key={request.id} 
            className={`group bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 ${config.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
          >
            {/* Header: Priority + Elapsed Time */}
            <div className="flex items-center justify-between mb-3">
              <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white ${config.bg} shadow-sm`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span className="uppercase tracking-wide">{request.priority}</span>
              </div>
              
              <div className="flex items-center space-x-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                <Timer className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{elapsed}</span>
              </div>
            </div>

            {/* Guest Info */}
            <div className="mb-3 space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">{request.guest_name}</h3>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Room {request.room_number}</span>
              </div>
            </div>

            {/* Request Details */}
            <div className="mb-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{request.title}</h4>
              {request.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{request.description}</p>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Type: <span className="font-medium text-gray-700 capitalize">{request.type}</span></span>
              <span>•</span>
              <span className="font-medium text-gray-700">
                {new Date(request.created_at).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => {
                logger.debug('RequestCard', 'Taking request', request.id);
                onTakeRequest(request.id);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Take Request
            </button>
          </div>
        );
      })}
    </div>
  );
}