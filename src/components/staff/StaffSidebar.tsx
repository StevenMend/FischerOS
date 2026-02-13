import React from 'react';
import { 
  Settings,
  Zap,
  AlertTriangle,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import MetricsWidget from './MetricsWidget';
import PartnerContacts from './PartnerContacts';

interface StaffSidebarProps {
  onEscalateIssue: () => void;
  onBroadcastUpdate: () => void;
  onViewAnalytics: () => void;
  onWeatherAlerts: () => void;
  onEquipmentStatus: () => void;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({
  onEscalateIssue,
  onBroadcastUpdate,
  onViewAnalytics,
  onWeatherAlerts,
  onEquipmentStatus
}) => {
  return (
    <div className="w-80 bg-white/80 backdrop-blur-xl shadow-2xl border-l border-white/20 stagger-item">
      <div className="p-6 space-y-6">
        {/* Personal Metrics */}
        <MetricsWidget />

        {/* Partner Contacts */}
        <PartnerContacts />

        {/* Department-Specific Tools */}
        <div>
          <h4 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-sm animate-float-subtle">
              <Settings className="w-4 h-4 text-white" />
            </div>
            Department Tools
          </h4>
          
          <div className="space-y-3">
            <button 
              onClick={onWeatherAlerts}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm text-blue-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-bold border border-blue-200/50 btn-premium ripple-effect"
            >
              <Settings className="w-5 h-5" />
              <span>Weather Alerts</span>
            </button>
            <button 
              onClick={onEquipmentStatus}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm text-green-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-bold border border-green-200/50 btn-premium ripple-effect"
            >
              <Settings className="w-5 h-5" />
              <span>Equipment Status</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dark rounded-lg flex items-center justify-center mr-3 shadow-sm animate-float-subtle">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Quick Actions
          </h4>
          
          <div className="space-y-3">
            <button 
              onClick={onEscalateIssue}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-sm btn-premium ripple-effect"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Escalate Issue</span>
            </button>
            
            <button 
              onClick={onBroadcastUpdate}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-sm btn-premium ripple-effect"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Broadcast Update</span>
            </button>
            
            <button 
              onClick={onViewAnalytics}
              className="w-full flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm text-gray-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold border border-white/50 btn-premium ripple-effect"
            >
              <TrendingUp className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};