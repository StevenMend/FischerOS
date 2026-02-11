import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';

export default function SessionWarningModal() {
  const [showWarning, setShowWarning] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const { refreshToken, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleSessionWarning = (event: CustomEvent) => {
      setMinutesLeft(event.detail.minutesLeft);
      setShowWarning(true);
    };

    window.addEventListener('session-warning', handleSessionWarning as EventListener);
    
    return () => {
      window.removeEventListener('session-warning', handleSessionWarning as EventListener);
    };
  }, []);

  const handleExtendSession = async () => {
    try {
      await refreshToken();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Session Expiring Soon</h3>
            <p className="text-sm text-gray-600">Your session will expire automatically</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''} remaining
            </span>
          </div>
          <p className="text-sm text-yellow-700">
            Would you like to extend your session and continue working?
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleLogout}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Logout Now
          </button>
          <button
            onClick={handleExtendSession}
            disabled={isLoading}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extending...</span>
              </div>
            ) : (
              'Extend Session'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}