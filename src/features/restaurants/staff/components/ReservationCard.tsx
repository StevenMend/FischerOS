// src/features/restaurants/staff/components/ReservationCard.tsx
import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, AlertCircle, CheckCircle, Utensils, X } from 'lucide-react';
import type { RestaurantReservation } from '../../api/types';

interface ReservationCardProps {
  reservation: RestaurantReservation;
  onConfirm?: (id: string, tableNumber?: string) => void;
  onSeat?: (id: string, tableNumber?: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
}

const getStatusConfig = (status: string) => {
  const configs = {
    'pending': {
      label: 'Pending',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: Clock,
    },
    'confirmed': {
      label: 'Confirmed',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: CheckCircle,
    },
    'seated': {
      label: 'Seated',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: Utensils,
    },
    'completed': {
      label: 'Completed',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircle,
    },
    'cancelled': {
      label: 'Cancelled',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: X,
    },
  };
  return configs[status as keyof typeof configs] || configs.pending;
};

function useElapsedTime(startTime: string | null) {
  const [elapsed, setElapsed] = useState('');

  React.useEffect(() => {
    if (!startTime) return;

    const update = () => {
      const diff = Date.now() - new Date(startTime).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) {
        setElapsed(`${mins}m`);
      } else {
        setElapsed(`${Math.floor(mins / 60)}h ${mins % 60}m`);
      }
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [startTime]);

  return elapsed;
}

export default function ReservationCard({
  reservation,
  onConfirm,
  onSeat,
  onComplete,
  onCancel
}: ReservationCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showTableInput, setShowTableInput] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [showSeatTableInput, setShowSeatTableInput] = useState(false);
  const [seatTableNumber, setSeatTableNumber] = useState('');

  const seatedElapsed = useElapsedTime(reservation.seated_at);

  const statusConfig = getStatusConfig(reservation.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleConfirmClick = () => {
    if (onConfirm) {
      setShowTableInput(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (onConfirm) {
      onConfirm(reservation.id, tableNumber || undefined);
      setShowTableInput(false);
      setTableNumber('');
    }
  };

  const handleCancelSubmit = () => {
    if (onCancel && cancelReason.trim()) {
      onCancel(reservation.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
    }
  };

  return (
    <>
      <div className={`bg-white/90 backdrop-blur-xl rounded-2xl p-4 border-2 ${statusConfig.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
        
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
            <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
            <span className={`text-xs font-bold ${statusConfig.text}`}>{statusConfig.label}</span>
          </div>
          
          {reservation.table_number && (
            <div className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-300">
              <span className="text-xs font-bold text-gray-700">Table {reservation.table_number}</span>
            </div>
          )}
        </div>

        {/* Guest Info */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{reservation.guest_name}</h3>
          {reservation.room_number && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Room {reservation.room_number}</span>
            </div>
          )}
        </div>

        {/* Reservation Details */}
        <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(reservation.reservation_date)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{formatTime(reservation.time_slot)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{reservation.party_size} guests</span>
          </div>
        </div>

        {/* Dietary Alert — prominent */}
        {reservation.dietary_restrictions && reservation.dietary_restrictions.length > 0 && (
          <div className="mb-3 p-3 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-800 uppercase">Dietary Alert</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {reservation.dietary_restrictions.map((d) => (
                <span key={d} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-300">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Occasion & Special Requests */}
        {(reservation.occasion || reservation.special_requests) && (
          <div className="space-y-2 mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            {reservation.occasion && (
              <div className="text-xs">
                <span className="font-semibold text-blue-900">Occasion:</span>
                <span className="text-blue-700 ml-1">{reservation.occasion}</span>
              </div>
            )}
            {reservation.special_requests && (
              <div className="text-xs">
                <span className="font-semibold text-blue-900">Notes:</span>
                <span className="text-blue-700 ml-1">{reservation.special_requests}</span>
              </div>
            )}
          </div>
        )}

        {/* Seated Timer */}
        {reservation.status === 'seated' && seatedElapsed && (
          <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Seated Time</span>
            <span className="text-sm font-bold text-purple-800">{seatedElapsed}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {/* Pending Actions */}
          {reservation.status === 'pending' && (
            <>
              {!showTableInput ? (
                <button
                  onClick={handleConfirmClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Confirm Reservation
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Table number (optional)"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleConfirmSubmit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setShowTableInput(false);
                        setTableNumber('');
                      }}
                      className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Confirmed Actions — Seat with table number */}
          {reservation.status === 'confirmed' && onSeat && (
            <>
              {!showSeatTableInput ? (
                <button
                  onClick={() => setShowSeatTableInput(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Seat Guest
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={seatTableNumber}
                    onChange={(e) => setSeatTableNumber(e.target.value)}
                    placeholder="Table number"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        onSeat(reservation.id, seatTableNumber || undefined);
                        setShowSeatTableInput(false);
                        setSeatTableNumber('');
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold text-sm"
                    >
                      Seat
                    </button>
                    <button
                      onClick={() => {
                        setShowSeatTableInput(false);
                        setSeatTableNumber('');
                      }}
                      className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Seated Actions */}
          {reservation.status === 'seated' && onComplete && (
            <button
              onClick={() => onComplete(reservation.id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Complete Service
            </button>
          )}

          {/* Cancel Button (for pending/confirmed) */}
          {(reservation.status === 'pending' || reservation.status === 'confirmed') && onCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl font-semibold text-sm border-2 border-red-200 transition-all"
            >
              Cancel Reservation
            </button>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
          Created {new Date(reservation.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cancel Reservation</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this reservation? Please provide a reason.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Cancellation reason..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none mb-4"
              rows={3}
            />

            <div className="flex space-x-3">
              <button
                onClick={handleCancelSubmit}
                disabled={!cancelReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Reservation
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
