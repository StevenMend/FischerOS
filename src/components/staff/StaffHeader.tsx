// src/components/staff/StaffHeader.tsx — Top bar with avatar, department, notifications
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useTenantOptional } from '../../core/tenant/TenantProvider';

interface StaffHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function StaffHeader({ sidebarOpen, onToggleSidebar }: StaffHeaderProps) {
  const { user } = useAuth();
  const tenant = useTenantOptional();

  const staffName = user?.name || 'Staff Member';
  const staffInitials = staffName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const department = user?.department || 'Operations';
  const propertyName = tenant?.propertyName || 'FischerOS';
  const notificationCount = 3;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left — Logo + Property */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">{propertyName}</p>
            <p className="text-xs text-gray-500">Operations</p>
          </div>
        </div>

        {/* Right — Notifications + Avatar */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-[18px] h-[18px] text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{notificationCount}</span>
              </span>
            )}
          </button>

          {/* Avatar + Info */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-xs">{staffInitials}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 leading-none">{staffName}</p>
              <p className="text-xs text-gray-500">{department}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
