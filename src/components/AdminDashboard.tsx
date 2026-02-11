import React, { useState } from 'react';
import { ArrowLeft, Zap, Download } from 'lucide-react';
import { useAdminDashboard } from '../hooks/admin/useAdminDashboard';
import { useModalManager } from '../hooks/admin/useModalManager';
import KPICard from './admin/KPICard';
import OperationsMonitor from './admin/OperationsMonitor';
import RevenueAnalytics from './admin/RevenueAnalytics';
import StaffPerformance from './admin/StaffPerformance';
import PartnerManagement from './admin/PartnerManagement';
import OperationalIntel from './admin/OperationalIntel';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const dashboardData = useAdminDashboard();
  const modalManager = useModalManager();
  const [showHeatMap, setShowHeatMap] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-primary via-primary-dark to-primary text-white px-6 py-4 shadow-2xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-xl">Executive Command Center</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={dashboardData.selectedTimeframe} 
              onChange={(e) => dashboardData.setSelectedTimeframe(e.target.value)}
              className="bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/20"
            >
              {dashboardData.timeframes.map(tf => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
            <select 
              value={dashboardData.selectedDepartment} 
              onChange={(e) => dashboardData.setSelectedDepartment(e.target.value)}
              className="bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/20"
            >
              {dashboardData.departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <button 
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className="p-3 rounded-xl bg-green-500/20"
            >
              <Zap className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-white/20 rounded-xl">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-full mx-auto px-6 py-8">
        <KPICard kpis={dashboardData.kpis} animationEnabled={animationEnabled} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <OperationsMonitor 
            resortHeatMap={dashboardData.resortHeatMap}
            departmentStatus={dashboardData.departmentStatus}
            showHeatMap={showHeatMap}
            onToggleHeatMap={() => setShowHeatMap(!showHeatMap)}
          />
          <RevenueAnalytics 
            revenueBreakdown={dashboardData.revenueBreakdown}
            expandedChart={modalManager.modals.expandedChart}
            onToggleExpand={() => modalManager.actions.toggleExpandedChart('revenue')}
          />
          <StaffPerformance 
            staffPerformance={dashboardData.staffPerformance}
            expandedChart={modalManager.modals.expandedChart}
            onToggleExpand={() => modalManager.actions.toggleExpandedChart('staff')}
            onSelectStaff={modalManager.actions.openStaffModal}
          />
          <PartnerManagement 
            partnerPerformance={dashboardData.partnerPerformance}
            expandedChart={modalManager.modals.expandedChart}
            onToggleExpand={() => modalManager.actions.toggleExpandedChart('partner')}
            onSelectPartner={modalManager.actions.openPartnerModal}
          />
          <OperationalIntel 
            expandedChart={modalManager.modals.expandedChart}
            onToggleExpand={() => modalManager.actions.toggleExpandedChart('intelligence')}
          />
        </div>
      </main>

      {/* Modals would go here - extracted to separate components */}
    </div>
  );
}