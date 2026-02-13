// src/pages/guest/GuestCardPage.tsx — Guest Card (profile/stay details)
import React from 'react';
import { User, Crown, Star, Gift, Settings, Edit, Heart } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';

export default function GuestCardPage() {
  const { user } = useAuth();
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
              <h1 className="text-3xl font-bold text-foreground font-display mb-2">{user?.name || 'Guest'}</h1>
              <p className="text-foreground/80 mb-4">Member{user?.room ? ` • Room ${user.room}` : ''}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">2,450 points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-green-500" />
                  <span className="text-foreground font-medium">4.9 rating</span>
                </div>
              </div>
            </div>
            <button className="bg-white border-2 border-surface-dark text-foreground px-6 py-3 rounded-2xl font-semibold hover:shadow-md transition-all duration-300">
              <Edit className="w-5 h-5 inline mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active Bookings", value: "3", icon: Gift },
            { label: "Total Visits", value: "12", icon: Heart },
            { label: "Savings", value: "$340", icon: Star },
            { label: "Referrals", value: "8", icon: Crown }
          ].map((stat, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-surface-dark shadow-lg text-center">
              <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-foreground/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-surface-dark shadow-lg text-center">
          <div className="w-16 h-16 bg-white border-2 border-surface-dark rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4 font-display">Advanced Profile Features</h2>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">Personalized preferences, booking history, loyalty rewards management, and exclusive member benefits coming soon.</p>
          <button className="bg-white border-2 border-surface-dark text-foreground px-8 py-3 rounded-2xl font-semibold hover:shadow-md transition-all duration-300">
            Get Notified
          </button>
        </div>
      </div>
    </div>
  );
}
