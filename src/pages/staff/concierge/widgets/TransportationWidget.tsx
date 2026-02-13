// src/pages/staff/concierge/widgets/TransportationWidget.tsx
import React from 'react';
import { Car, Clock, MapPin, User } from 'lucide-react';

interface TransportRequest {
  id: string;
  guestName: string;
  destination: string;
  time: string;
  status: 'pending' | 'assigned' | 'in_transit';
  vehicleType: string;
}

export function TransportationWidget() {
  // Mock data - replace with real data
  const activeRequests: TransportRequest[] = [
    {
      id: '1',
      guestName: 'Guest 301',
      destination: 'Airport (LIR)',
      time: '2:30 PM',
      status: 'assigned',
      vehicleType: 'Sedan'
    },
    {
      id: '2',
      guestName: 'Guest 205',
      destination: 'Downtown',
      time: '3:00 PM',
      status: 'pending',
      vehicleType: 'Van'
    }
  ];

  const stats = {
    active: 2,
    pending: 1,
    completed: 8
  };

  const quickDestinations = [
    { name: 'Airport', icon: '✈️', eta: '45 min' },
    { name: 'Downtown', icon: '🏪', eta: '10 min' },
    { name: 'Beach Club', icon: '🏖️', eta: '5 min' },
    { name: 'Marina', icon: '⛵', eta: '15 min' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 border-b border-blue-200">
        <div className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-sm">Transportation</h3>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-blue-50/50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{stats.active}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-600">Today</p>
          </div>
        </div>
      </div>

      {/* Active Requests */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Active Requests
        </h4>
        
        <div className="space-y-2">
          {activeRequests.map((request) => (
            <div
              key={request.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900 text-sm">
                    {request.guestName}
                  </span>
                </div>
                {request.status === 'assigned' && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                    🚗 Assigned
                  </span>
                )}
                {request.status === 'pending' && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded border border-yellow-200">
                    ⏳ Pending
                  </span>
                )}
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>{request.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{request.time} • {request.vehicleType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeRequests.length === 0 && (
          <div className="text-center py-4">
            <Car className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No active requests</p>
          </div>
        )}
      </div>

      {/* Quick Destinations */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Quick Destinations
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {quickDestinations.map((dest, index) => (
            <button
              key={index}
              className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left"
            >
              <span className="text-lg">{dest.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {dest.name}
                </p>
                <p className="text-xs text-gray-500">{dest.eta}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* New Request Button */}
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors border border-blue-200">
          + New Transport Request
        </button>
      </div>
    </div>
  );
}