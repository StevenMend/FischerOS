// src/components/staff/StaffHeader.tsx - FIXES FINALES
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  BarChart3
} from 'lucide-react';

interface StaffHeaderProps {
  selectedDepartment?: string;
  departments?: string[];
  onDepartmentSelect?: (department: string) => void;
}

export default function StaffHeader({
  selectedDepartment = 'Tours',
  departments = ['Tours', 'Restaurants', 'Spa', 'Concierge'],
  onDepartmentSelect
}: StaffHeaderProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const staffName = user?.name || 'Ana Gutierrez';
  const staffInitials = staffName.split(' ').map(n => n[0]).join('').substring(0, 2);
  const notificationCount = 7;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/portal';
  };

  return (
    <>
      <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-accent font-bold text-sm">TD</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm text-gray-600 font-medium">{selectedDepartment}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              
              <div className="hidden lg:flex items-center px-4 py-2 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">{staffName}</span>
              </div>

              <button className="relative w-11 h-11 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all flex items-center justify-center group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold text-white">{notificationCount}</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-11 h-11 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all flex items-center justify-center group"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: '64px' }}
          />
          
          <div className="fixed top-16 right-0 w-80 bg-white border-l border-gray-200 z-[70] shadow-2xl h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-6 space-y-6">
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-base font-bold text-white">{staffInitials}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{staffName}</p>
                  <p className="text-sm text-gray-600">{selectedDepartment}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:shadow-md hover:border-primary/40 transition-all text-sm"
                  >
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>Today's Summary</span>
                  </button>
                </div>
              </div>

              {departments && departments.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Department</h3>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      if (onDepartmentSelect) {
                        onDepartmentSelect(e.target.value);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-700"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">System</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:shadow-md transition-all text-sm"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-red-200 text-red-600 rounded-2xl font-semibold hover:bg-red-50 hover:shadow-md transition-all text-sm"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}