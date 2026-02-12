// src/pages/admin/AdminAnalyticsPage.tsx
import React from 'react';
import { TrendingUp, BarChart3, PieChart, Activity, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAdminMetrics } from '../../hooks/admin/useAdminMetrics';

export default function AdminAnalyticsPage() {
  const {
    departmentMetrics,
    staffPerformance,
    totalRequests,
    totalPending,
    totalInProgress,
    totalCompleted,
    overallSatisfaction,
    loading,
    error,
    timeframe,
    setTimeframe
  } = useAdminMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Analytics</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent">Executive Analytics</h1>
          <div className="flex items-center space-x-2 text-sm text-green-600 mt-1">
            <Activity className="w-4 h-4" />
            <span className="font-medium">Live Data</span>
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="px-4 py-2 border-2 border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-accent focus:border-accent"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Requests"
          value={totalRequests}
          icon={Activity}
          color="blue"
        />
        <KPICard
          title="Pending"
          value={totalPending}
          icon={AlertTriangle}
          color="orange"
        />
        <KPICard
          title="In Progress"
          value={totalInProgress}
          icon={Clock}
          color="purple"
        />
        <KPICard
          title="Completed"
          value={totalCompleted}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Overall Satisfaction */}
      {overallSatisfaction !== null && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PieChart className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Overall Satisfaction</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-bold text-green-600">
                {overallSatisfaction.toFixed(1)}
              </span>
              <span className="text-gray-500 text-lg">/5.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Department Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h3 className="text-xl font-semibold text-gray-900">Department Performance</h3>
        </div>
        
        {departmentMetrics.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No department data available</p>
        ) : (
          <div className="space-y-4">
            {departmentMetrics.map(dept => (
              <DepartmentRow key={dept.department_id} dept={dept} />
            ))}
          </div>
        )}
      </div>

      {/* Staff Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-8 h-8 text-accent" />
          <h3 className="text-xl font-semibold text-gray-900">Top Performers</h3>
        </div>
        
        {staffPerformance.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No staff performance data available</p>
        ) : (
          <div className="space-y-4">
            {staffPerformance
              .sort((a, b) => b.requests_completed - a.requests_completed)
              .slice(0, 10)
              .map(staff => (
                <StaffRow key={staff.staff_id} staff={staff} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
interface KPICardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'orange' | 'purple' | 'green';
}

function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 font-medium">{title}</span>
        <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[1]}`} />
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

interface DepartmentRowProps {
  dept: any;
}

function DepartmentRow({ dept }: DepartmentRowProps) {
  const completionRate = dept.completion_rate.toFixed(1);
  const avgResponseTime = dept.avg_response_time_minutes 
    ? dept.avg_response_time_minutes.toFixed(1) 
    : 'N/A';

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{dept.department_name}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {dept.total_requests} total • {dept.completed_requests} completed • {dept.pending_requests} pending
        </p>
        {dept.avg_response_time_minutes && (
          <p className="text-xs text-gray-500 mt-1">
            Avg response: {avgResponseTime} min
          </p>
        )}
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-primary">{completionRate}%</div>
        <p className="text-xs text-gray-500">completion</p>
      </div>
    </div>
  );
}

interface StaffRowProps {
  staff: any;
}

function StaffRow({ staff }: StaffRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{staff.staff_name}</h4>
        <p className="text-sm text-gray-600">{staff.department_name}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">
          {staff.requests_completed} completed
        </div>
        {staff.avg_rating && (
          <p className="text-sm text-accent">
            ⭐ {staff.avg_rating.toFixed(1)} avg
          </p>
        )}
      </div>
    </div>
  );
}