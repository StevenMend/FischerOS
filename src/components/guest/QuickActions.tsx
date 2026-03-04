// src/components/guest/QuickActions.tsx - FIXED VERSION
import React from 'react';
import { LucideIcon, Phone, MessageSquare, Camera, Coffee } from 'lucide-react';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  action?: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const defaultActions: QuickAction[] = [
    { icon: Phone, label: 'Call Concierge', color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { icon: MessageSquare, label: 'Chat Support', color: 'text-green-600', bg: 'bg-green-500/10' },
    { icon: Camera, label: 'Photo Request', color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { icon: Coffee, label: 'Room Service', color: 'text-amber-600', bg: 'bg-amber-500/10' }
  ];

  const data = actions || defaultActions;

  return (
    <div className="mb-32 pb-4"> {/* Added more bottom margin and padding */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-item"> {/* Increased gap */}
        {data.map((action, index) => (
          <button 
            key={index}
            onClick={action.action}
            className="group p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[120px] touch-target btn-premium ripple-effect gpu-accelerated hover:bg-white/80"
          >
            <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 icon-bounce shadow-lg`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <div className="text-sm font-medium text-gray-900 text-center leading-tight">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}