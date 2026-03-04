// src/pages/guest/GuestCardPage.tsx — Guest Card with real Supabase data
import React from 'react';
import {
  User, Calendar, CheckCircle, ClipboardList, Clock, Settings, Edit,
  Heart, Globe, Utensils, Compass, Flower2, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useGuestInfo } from '../../hooks/guest/useGuestInfo';
import { useGuestRequests } from '../../hooks/guest/useGuestRequests';

const activityIcons: Record<string, typeof AlertCircle> = {
  service_request: AlertCircle,
  restaurant: Utensils,
  tour: Compass,
  spa: Flower2,
};

const activityColors: Record<string, string> = {
  service_request: 'text-gray-600 bg-gray-50',
  restaurant: 'text-amber-600 bg-amber-50',
  tour: 'text-blue-600 bg-blue-50',
  spa: 'text-pink-600 bg-pink-50',
};

export default function GuestCardPage() {
  const { user } = useAuth();
  const { data: guestProfile, isLoading: profileLoading } = useGuestInfo();
  const { activeRequests, completedRequests, allRequests, loading: requestsLoading } = useGuestRequests();

  const isLoading = profileLoading || requestsLoading;

  const displayName = guestProfile?.name || user?.name || 'Guest';
  const displayRoom = guestProfile?.room_number || user?.room || '';
  const checkIn = guestProfile?.check_in || '';
  const checkOut = guestProfile?.check_out || '';
  const prefs = guestProfile?.preferences;

  const stats = [
    { label: 'Active Bookings', value: String(activeRequests.length), icon: Calendar },
    { label: 'Completed', value: String(completedRequests.length), icon: CheckCircle },
    { label: 'Total Activities', value: String(allRequests.length), icon: ClipboardList },
    { label: 'Pending', value: String(activeRequests.filter(r => r.status === 'pending').length), icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-surface-dark shadow-lg mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white border-2 border-surface-dark rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 sm:w-10 sm:h-10 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground font-display mb-1">{displayName}</h1>
              <p className="text-foreground/80 text-sm sm:text-base mb-1">
                {displayRoom ? `Room ${displayRoom}` : 'Guest'}
              </p>
              {(checkIn || checkOut) && (
                <p className="text-foreground/60 text-xs sm:text-sm">
                  {checkIn && `Check-in: ${new Date(checkIn).toLocaleDateString()}`}
                  {checkIn && checkOut && ' · '}
                  {checkOut && `Check-out: ${new Date(checkOut).toLocaleDateString()}`}
                </p>
              )}
            </div>
            <button className="w-full sm:w-auto bg-white border-2 border-surface-dark text-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:shadow-md transition-all text-sm sm:text-base">
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Real Stats from Supabase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-surface-dark shadow-sm text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-surface-dark rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground mb-0.5">{stat.value}</div>
              <div className="text-foreground/70 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Preferences Section */}
        {prefs && (prefs.dietary?.length || prefs.interests?.length || prefs.language) && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-surface-dark shadow-lg mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-surface-dark rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground font-display">Preferences</h2>
            </div>
            <div className="space-y-3">
              {prefs.language && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-foreground/50" />
                  <span className="text-sm text-foreground/70">Language:</span>
                  <span className="text-sm font-medium text-foreground capitalize">{prefs.language}</span>
                </div>
              )}
              {prefs.dietary && prefs.dietary.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-4 h-4 text-foreground/50" />
                    <span className="text-sm text-foreground/70">Dietary:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prefs.dietary.map((d) => (
                      <span key={d} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium capitalize">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {prefs.interests && prefs.interests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-4 h-4 text-foreground/50" />
                    <span className="text-sm text-foreground/70">Interests:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prefs.interests.map((i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium capitalize">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking History Timeline */}
        {completedRequests.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-surface-dark shadow-lg mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-surface-dark rounded-xl sm:rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground font-display">Completed Activities</h2>
            </div>
            <div className="space-y-3">
              {completedRequests.slice(0, 8).map((activity) => {
                const Icon = activityIcons[activity.type] || AlertCircle;
                const color = activityColors[activity.type] || 'text-gray-600 bg-gray-50';
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-light">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                      <p className="text-xs text-foreground/60">
                        {new Date(activity.created_at).toLocaleDateString()}
                        {activity.rating && ` · ${activity.rating}/5`}
                      </p>
                    </div>
                    {activity.rating && (
                      <span className="text-yellow-500 text-sm">{'*'.repeat(activity.rating)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Guest Info Details */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-surface-dark shadow-lg">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-surface-dark rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-display">Stay Details</h2>
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
  );
}
