// src/pages/guest/GuestCardPage.tsx — Guest Card with real Supabase data
import React from 'react';
import { User, Calendar, CheckCircle, ClipboardList, Clock, Settings, Edit } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useGuestInfo } from '../../hooks/guest/useGuestInfo';
import { useGuestRequests } from '../../hooks/guest/useGuestRequests';

export default function GuestCardPage() {
  const { user } = useAuth();
  const { data: guestProfile, isLoading: profileLoading } = useGuestInfo();
  const { activeRequests, completedRequests, allRequests, loading: requestsLoading } = useGuestRequests();

  const isLoading = profileLoading || requestsLoading;

  const displayName = guestProfile?.name || user?.name || 'Guest';
  const displayRoom = guestProfile?.room_number || user?.room || '';
  const checkIn = guestProfile?.check_in || '';
  const checkOut = guestProfile?.check_out || '';

  const stats = [
    { label: 'Active Bookings', value: String(activeRequests.length), icon: Calendar },
    { label: 'Completed', value: String(completedRequests.length), icon: CheckCircle },
    { label: 'Total Activities', value: String(allRequests.length), icon: ClipboardList },
    { label: 'Pending', value: String(activeRequests.filter(r => r.status === 'pending').length), icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-surface-dark shadow-lg mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white border-2 border-surface-dark rounded-3xl flex items-center justify-center">
              <User className="w-10 h-10 text-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground font-display mb-2">{displayName}</h1>
              <p className="text-foreground/80 mb-2">
                {displayRoom ? `Room ${displayRoom}` : 'Guest'}
              </p>
              {(checkIn || checkOut) && (
                <p className="text-foreground/60 text-sm">
                  {checkIn && `Check-in: ${new Date(checkIn).toLocaleDateString()}`}
                  {checkIn && checkOut && ' · '}
                  {checkOut && `Check-out: ${new Date(checkOut).toLocaleDateString()}`}
                </p>
              )}
            </div>
            <button className="bg-white border-2 border-surface-dark text-foreground px-6 py-3 rounded-2xl font-semibold hover:shadow-md transition-all duration-300">
              <Edit className="w-5 h-5 inline mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Real Stats from Supabase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-surface-dark shadow-lg text-center">
              <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-foreground/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Guest Info Details */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-surface-dark shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground font-display">Stay Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guestProfile?.email && (
              <div className="p-4 bg-surface-light rounded-2xl">
                <div className="text-foreground/60 text-sm mb-1">Email</div>
                <div className="text-foreground font-medium">{guestProfile.email}</div>
              </div>
            )}
            {guestProfile?.phone && (
              <div className="p-4 bg-surface-light rounded-2xl">
                <div className="text-foreground/60 text-sm mb-1">Phone</div>
                <div className="text-foreground font-medium">{guestProfile.phone}</div>
              </div>
            )}
            {displayRoom && (
              <div className="p-4 bg-surface-light rounded-2xl">
                <div className="text-foreground/60 text-sm mb-1">Room</div>
                <div className="text-foreground font-medium">{displayRoom}</div>
              </div>
            )}
            {guestProfile?.status && (
              <div className="p-4 bg-surface-light rounded-2xl">
                <div className="text-foreground/60 text-sm mb-1">Status</div>
                <div className="text-foreground font-medium capitalize">{String(guestProfile.status)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
