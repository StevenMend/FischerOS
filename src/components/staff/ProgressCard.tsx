// src/components/staff/ProgressCard.tsx - PRO VERSION WITH REAL DB DATA
import React from 'react';
import { Timer, User, MapPin, Clock, CheckCircle } from 'lucide-react';
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
  started_at: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
}

interface ProgressCardProps {
  items: ServiceRequest[];
  onUpdateStatus: (requestId: string, newStatus: string) => void;
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

const getStatusBadge = (status: string) => {
  const badges = {
    'assigned': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Assigned' },
    'in-progress': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Progress' }
  };
  
  return badges[status as keyof typeof badges] || badges['assigned'];
};

export default function ProgressCard({ items, onUpdateStatus }: ProgressCardProps) {
  logger.debug('ProgressCard', 'render', { count: items.length });

  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No active requests</p>
        <p className="text-gray-400 text-sm mt-1">Take a pending request to start</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => {
        const elapsed = calculateElapsedTime(item.created_at);
        const statusBadge = getStatusBadge(item.status);
        
        logger.debug('ProgressCard', 'Rendering card', {
          id: item.id,
          title: item.title,
          status: item.status,
          assignedTo: item.assigned_to_name
        });
        
        return (
          <div 
            key={item.id} 
            className="group bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Header: Status + Time */}
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusBadge.bg} ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
              
              <div className="flex items-center space-x-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <Timer className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{elapsed}</span>
              </div>
            </div>

            {/* Guest Info */}
            <div className="mb-3 space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.guest_name}</h3>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Room {item.room_number}</span>
              </div>
            </div>

            {/* Request Details */}
            <div className="mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
              )}
            </div>

            {/* Assigned To */}
            {item.assigned_to_name && (
              <div className="mb-3 flex items-center space-x-2 text-xs text-gray-600">
                <span className="font-medium">Assigned to:</span>
                <span className="text-blue-700 font-semibold">{item.assigned_to_name}</span>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
              <Clock className="w-3.5 h-3.5" />
              <span className="capitalize">{item.type}</span>
              <span>•</span>
              <span>
                {new Date(item.created_at).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  logger.debug('ProgressCard', 'Moving to in-progress', item.id);
                  onUpdateStatus(item.id, 'in-progress');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold text-xs transition-all duration-300"
              >
                Start Work
              </button>
              
              <button 
                onClick={() => {
                  logger.debug('ProgressCard', 'Completing request', item.id);
                  onUpdateStatus(item.id, 'completed');
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 transition-all duration-300"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Complete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}