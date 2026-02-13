// src/components/staff/StaffSidebar.tsx — Left sidebar with navigation + department tools
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Users2, Handshake, BarChart3,
  Zap, LogOut, Settings, CircleDot,
  UtensilsCrossed, Palmtree, Sparkles, ConciergeBell, BedDouble,
  Wrench, Car, MonitorSmartphone,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useTenantNavigation } from '../../core/tenant/useTenantNavigation';

// Department → staff sub-route + icon
const DEPT_ROUTES: Record<string, { route: string; icon: typeof LayoutDashboard; label: string }> = {
  'food & beverage':    { route: 'restaurant', icon: UtensilsCrossed, label: 'Restaurant Dashboard' },
  'restaurants':        { route: 'restaurant', icon: UtensilsCrossed, label: 'Restaurant Dashboard' },
  'tours & activities': { route: 'tours',      icon: Palmtree,        label: 'Tours Dashboard' },
  'spa':                { route: 'spa',         icon: Sparkles,        label: 'Spa Dashboard' },
  'concierge':          { route: 'concierge',   icon: ConciergeBell,   label: 'Concierge Dashboard' },
  'housekeeping':       { route: 'housekeeping', icon: BedDouble,      label: 'Housekeeping Dashboard' },
  'maintenance':        { route: 'maintenance', icon: Wrench,          label: 'Maintenance Dashboard' },
  'transportation':     { route: 'transportation', icon: Car,          label: 'Transportation Dashboard' },
  'front desk':         { route: 'console',     icon: MonitorSmartphone, label: 'Front Desk Console' },
};

interface StaffSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function StaffSidebar({ open, onClose }: StaffSidebarProps) {
  const { user, logout } = useAuth();
  const { staffPath } = useTenantNavigation();
  const location = useLocation();
  const navigate = useNavigate();

  const staffName = user?.name || 'Staff Member';
  const staffInitials = staffName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const department = user?.department || 'Operations';
  const deptKey = department.toLowerCase();
  const deptInfo = DEPT_ROUTES[deptKey];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/portal';
  };

  const isActive = (path: string) => location.pathname === path;

  // ── Nav items ───────────────────────────────────────────────────
  const mainNav = [
    { label: 'Console',       icon: LayoutDashboard, path: staffPath('console') },
    { label: 'All Requests',  icon: ClipboardList,   path: staffPath('requests') },
    { label: 'Coordination',  icon: Users2,          path: staffPath('coordination') },
    { label: 'Partners',      icon: Handshake,       path: staffPath('partners') },
    { label: 'Analytics',     icon: BarChart3,        path: staffPath('analytics') },
  ];

  // ── Render ──────────────────────────────────────────────────────
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Profile */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-sm">{staffInitials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{staffName}</p>
            <p className="text-xs text-gray-500 truncate">{department}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <CircleDot className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
            <span className="text-[10px] text-emerald-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
        <nav className="space-y-0.5">
          {mainNav.map(item => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => { e.preventDefault(); onClose(); navigate(item.path); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${active ? 'text-primary' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Department section */}
        {deptInfo && (
          <>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-6">My Department</p>
            <nav className="space-y-0.5">
              <a
                href={staffPath(deptInfo.route)}
                onClick={(e) => { e.preventDefault(); onClose(); navigate(staffPath(deptInfo.route)); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(staffPath(deptInfo.route))
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <deptInfo.icon className="w-[18px] h-[18px] text-gray-400" />
                <span>{deptInfo.label}</span>
              </a>
            </nav>

            {/* Quick escalate */}
            <button className="flex items-center gap-3 px-3 py-2 mt-2 w-full rounded-lg text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
              <Zap className="w-[18px] h-[18px] text-amber-500" />
              <span>Quick Escalate</span>
            </button>
          </>
        )}
      </div>

      {/* Bottom — Settings + Logout */}
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Settings className="w-[18px] h-[18px] text-gray-400" />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-14 lg:left-0 bg-white border-r border-gray-200 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed top-14 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-[70] lg:hidden shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
