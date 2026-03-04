import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, LogOut } from 'lucide-react';
import { ROUTE_PATHS } from '../../config/routes';

export default function SessionExpiredModal() {
  const [showExpired, setShowExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowExpired(true);
    };

    window.addEventListener('session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const handleReturnToLanding = () => {
    setShowExpired(false);
    navigate(ROUTE_PATHS.landing);
  };

  if (!showExpired) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Session Expired</h3>
            <p className="text-sm text-gray-600">Please log in again to continue</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">
            Your session has expired for security reasons. You'll need to authenticate again to access the system.
          </p>
        </div>

        <button
          onClick={handleReturnToLanding}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Return to Login</span>
        </button>
      </div>
    </div>
  );
}