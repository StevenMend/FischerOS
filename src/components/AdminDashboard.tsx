import React, { useState } from 'react';
import { Zap, Download } from 'lucide-react';
import { useAdminDashboard } from '../hooks/admin/useAdminDashboard';
import { useModalManager } from '../hooks/admin/useModalManager';
import KPICard from './admin/KPICard';
import OperationsMonitor from './admin/OperationsMonitor';
import RevenueAnalytics from './admin/RevenueAnalytics';
import StaffPerformance from './admin/StaffPerformance';
import PartnerManagement from './admin/PartnerManagement';
import OperationalIntel from './admin/OperationalIntel';

export default function AdminDashboard() {
  const dashboardData = useAdminDashboard();
  const modalManager = useModalManager();
  const [showHeatMap, setShowHeatMap] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-accent">Executive Command Center</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dashboardData.selectedTimeframe}
            onChange={(e) => dashboardData.setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border-2 border-gray-200 font-medium text-gray-700 focus:ring-2 focus:ring-accent focus:border-accent"
          >
            {dashboardData.timeframes.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
          <select
            value={dashboardData.selectedDepartment}
            onChange={(e) => dashboardData.setSelectedDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border-2 border-gray-200 font-medium text-gray-700 focus:ring-2 focus:ring-accent focus:border-accent"
          >
            {dashboardData.departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className="p-2 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Zap className={`w-4 h-4 ${animationEnabled ? 'text-green-500' : 'text-gray-400'}`} />
          </button>
          <button className="p-2 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <KPICard kpis={dashboardData.kpis} animationEnabled={animationEnabled} />
        
      {/* Widgets Grid */}
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
    </div>
  );
}