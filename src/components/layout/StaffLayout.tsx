// src/components/layout/StaffLayout.tsx — Header + Left Sidebar + Main Content
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StaffHeader from '../staff/StaffHeader';
import StaffSidebar from '../staff/StaffSidebar';

export default function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — full width, sticky top */}
      <StaffHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
      />

      {/* Sidebar — fixed left on desktop, overlay on mobile */}
      <StaffSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <main className="lg:pl-60 pt-0">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
