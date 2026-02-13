// src/components/guest/ProfileDropdown.tsx
import React from 'react';
import { User, Shield, Wifi, LogOut } from 'lucide-react';

interface GuestInfo {
  name: string;
  room: string;
  tier: string;
  email?: string;
  phone?: string;
}

interface ProfileDropdownProps {
  isOpen: boolean;
  guestInfo: GuestInfo;
  onClose: () => void;
}

export default function ProfileDropdown({ isOpen, guestInfo, onClose }: ProfileDropdownProps) {
  if (!isOpen) return null;

  const profileActions = [
    { icon: User, label: 'Profile Settings', action: () => {} },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
    { icon: Wifi, label: 'WiFi Settings', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: () => {} }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm modal-backdrop"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="fixed top-20 right-6 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden notification-enter modal-content">
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center animate-float-subtle">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">{guestInfo.name}</div>
              <div className="text-sm text-gray-600">
                {guestInfo.tier} Member • Room {guestInfo.room}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          {profileActions.map((item, index) => (
            <button 
              key={index}
              onClick={item.action}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-colors duration-200 text-left btn-premium"
            >
              <item.icon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}