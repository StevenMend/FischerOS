// src/components/staff/CompletedCard.tsx - PRO VERSION WITH REAL DB DATA
import React from 'react';
import { Star, User, MapPin, Clock, CheckCircle } from 'lucide-react';
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
  completed_at: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
  rating: number | null;
  feedback: string | null;
}

interface CompletedCardProps {
  items: ServiceRequest[];
  onCollectSatisfaction: (item: ServiceRequest) => void;
}

const calculateDuration = (createdAt: string, completedAt: string | null): string => {
  if (!completedAt) return 'N/A';
  
  const created = new Date(createdAt);
  const completed = new Date(completedAt);
  const diffMs = completed.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours}h ${diffMins % 60}m`;
};

export default function CompletedCard({ items, onCollectSatisfaction }: CompletedCardProps) {
  logger.debug('CompletedCard', 'render', { count: items.length });

  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No completed requests</p>
        <p className="text-gray-400 text-sm mt-1">Completed items will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => {
        const duration = calculateDuration(item.created_at, item.completed_at);
        const completedTime = item.completed_at 
          ? new Date(item.completed_at).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit' 
            })
          : 'N/A';
        
        logger.debug('CompletedCard', 'Rendering card', {
          id: item.id,
          title: item.title,
          rating: item.rating,
          hasFeedback: !!item.feedback
        });
        
        return (
          <div 
            key={item.id} 
            className="group bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] opacity-90"
          >
            {/* Header: Guest + Rating */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{item.guest_name}</h3>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Room {item.room_number}</span>
                </div>
              </div>
              
              {item.rating ? (
                <div className="flex items-center space-x-1 ml-2 flex-shrink-0 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-bold text-gray-900">{item.rating}/5</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg">
                  No rating
                </span>
              )}
            </div>

            {/* Request Details */}
            <div className="mb-3 p-2.5 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
              )}
            </div>

            {/* Feedback - if exists */}
            {item.feedback && (
              <div className="mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 italic line-clamp-2">"{item.feedback}"</p>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium text-gray-700">{duration}</span>
              </div>
              <span>•</span>
              <span>{completedTime}</span>
              {item.assigned_to_name && (
                <>
                  <span>•</span>
                  <span className="text-green-700 font-medium">{item.assigned_to_name}</span>
                </>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-green-100 text-green-700 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
              
              <span className="text-xs text-gray-500 capitalize">{item.type}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}