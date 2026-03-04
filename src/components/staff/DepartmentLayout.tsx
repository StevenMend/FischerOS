// src/components/staff/DepartmentLayout.tsx - Reusable base layout for all departments
import React, { ReactNode, useState } from 'react';
import { TrendingUp, AlertTriangle, Activity, CheckCircle } from 'lucide-react';

export type DepartmentColor = 'green' | 'orange' | 'indigo' | 'purple' | 'teal';

interface DepartmentLayoutProps {
  // Department Info
  departmentName: string;
  departmentIcon: ReactNode;
  departmentColor: DepartmentColor;
  
  // Staff Info
  staffName: string;
  
  // Metrics
  metrics: {
    pending: number;
    inProgress: number;
    completedToday: number;
    avgTime?: string;
  };
  
  // Column Data
  pendingItems: any[];
  inProgressItems: any[];
  completedItems: any[];
  
  // Render Card Function
  renderCard: (item: any, actions: {
    onTake?: () => void;
    onComplete?: () => void;
  }) => ReactNode;
  
  // Sidebar Widgets (optional, department-specific)
  sidebarWidgets?: ReactNode;
  
  // Loading State
  loading?: boolean;
}

const colorSchemes: Record<DepartmentColor, any> = {
  green: {
    bg: 'from-green-50 to-emerald-50',
    header: 'from-green-500 to-emerald-500',
    badge: 'bg-green-100 text-green-700 border-green-200',
  },
  orange: {
    bg: 'from-orange-50 to-red-50',
    header: 'from-orange-500 to-red-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  indigo: {
    bg: 'from-indigo-50 to-blue-50',
    header: 'from-indigo-500 to-blue-500',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  purple: {
    bg: 'from-purple-50 to-pink-50',
    header: 'from-purple-500 to-pink-500',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  teal: {
    bg: 'from-teal-50 to-cyan-50',
    header: 'from-teal-500 to-cyan-500',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
  }
};

type TabType = 'pending' | 'progress' | 'completed';

export const DepartmentLayout: React.FC<DepartmentLayoutProps> = ({
  departmentName,
  departmentIcon,
  departmentColor,
  staffName,
  metrics,
  pendingItems,
  inProgressItems,
  completedItems,
  renderCard,
  sidebarWidgets,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const colors = colorSchemes[departmentColor];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading {departmentName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${colors.header} rounded-xl flex items-center justify-center shadow-md`}>
            {departmentIcon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{departmentName}</h1>
            <p className="text-sm text-gray-500">{staffName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 font-bold">Live</span>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{metrics.pending}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-2xl font-bold text-blue-600">{metrics.inProgress}</p>
            <p className="text-xs text-gray-600">In Progress</p>
          </div>
          <div className="text-center border-r border-gray-200">
            <p className="text-2xl font-bold text-green-600">{metrics.completedToday}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{metrics.avgTime || '--'}</p>
            <p className="text-xs text-gray-600">Avg Time</p>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <nav className="lg:hidden sticky top-14 bg-white border border-gray-200 rounded-xl z-30 shadow-sm mb-4">
        <div className="w-full px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                activeTab === 'pending'
                  ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Pending</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {pendingItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                activeTab === 'progress'
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Active</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {inProgressItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                activeTab === 'completed'
                  ? 'bg-green-50 text-green-700 border-2 border-green-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Done</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {completedItems.length}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          {activeTab === 'pending' && (
            pendingItems.length > 0 ? (
              pendingItems.map((item) => renderCard(item, {}))
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No pending items</p>
              </div>
            )
          )}

          {activeTab === 'progress' && (
            inProgressItems.length > 0 ? (
              inProgressItems.map((item) => renderCard(item, {}))
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No active items</p>
              </div>
            )
          )}

          {activeTab === 'completed' && (
            completedItems.length > 0 ? (
              completedItems.map((item) => renderCard(item, {}))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No completed items</p>
              </div>
            )
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block pt-2">
          <div className="flex gap-6">
            {/* 3-Column Kanban */}
            <div className="flex-1 grid grid-cols-3 gap-6">
              {/* Pending Column */}
              <section className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Pending</h2>
                  </div>
                  <div className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-yellow-200">
                    {pendingItems.length}
                  </div>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                  {pendingItems.map((item) => renderCard(item, {}))}
                  {pendingItems.length === 0 && (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No pending</p>
                    </div>
                  )}
                </div>
              </section>

              {/* In Progress Column */}
              <section className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">In Progress</h2>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-blue-200">
                    {inProgressItems.length}
                  </div>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                  {inProgressItems.map((item) => renderCard(item, {}))}
                  {inProgressItems.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No active</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Completed Column */}
              <section className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Completed</h2>
                  </div>
                  <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-green-200">
                    {completedItems.length}
                  </div>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                  {completedItems.map((item) => renderCard(item, {}))}
                  {completedItems.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No completed</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Widgets */}
            {sidebarWidgets && (
              <aside className="w-80 space-y-6">
                {sidebarWidgets}
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};