// src/components/admin/PartnerManagement.tsx
import React from 'react';
import { Target, Star, Maximize2, Minimize2 } from 'lucide-react';
import { getTierBadge, getStatusBadge, getEfficiencyColor } from '../../lib/theme/variants';

interface Partner {
  name: string;
  score: number;
  bookings: number;
  revenue: string;
  status: 'excellent' | 'good';
  contractCompliance: number;
  paymentStatus: 'current' | 'overdue';
  responseTime: string;
  commission: string;
  issues: number;
  reliability: number;
  growth: string;
  satisfaction: number;
  tier: 'platinum' | 'gold' | 'silver';
}

interface PartnerManagementProps {
  partnerPerformance: Partner[];
  expandedChart: string | null;
  onToggleExpand: () => void;
  onSelectPartner: (partner: Partner) => void;
}

export default function PartnerManagement({
  partnerPerformance,
  expandedChart,
  onToggleExpand,
  onSelectPartner,
}: PartnerManagementProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl border border-white/50 hover:scale-[1.01] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-24 h-24 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <Target className="w-4 h-4 text-white" />
            </div>
            Partner Management
          </h2>
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-indigo-100 rounded-lg transition-all duration-300 hover:scale-110"
          >
            {expandedChart === 'partner' ? <Minimize2 className="w-4 h-4 text-indigo-600" /> : <Maximize2 className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
        <div className="space-y-3">
          {partnerPerformance.slice(0, 4).map((partner, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-white/60 to-white/40 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => onSelectPartner(partner)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="font-bold text-gray-900 text-sm">{partner.name}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${getTierBadge(partner.tier)}`}>{partner.tier}</div>
                  </div>
                  <div className="text-xs text-gray-600">{partner.bookings} bookings</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg font-bold text-indigo-600">{partner.score}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusBadge(partner.status)}`}>{partner.status}</span>
                  </div>
                  <div className="text-xs text-gray-600">{partner.revenue}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className={`text-sm font-bold ${getEfficiencyColor(partner.reliability)}`}>{partner.reliability}%</div>
                  <div className="text-xs text-gray-600">Reliability</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-bold text-gray-900">{partner.satisfaction}</span>
                  </div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-sm font-bold text-green-600">{partner.growth}</div>
                  <div className="text-xs text-gray-600">Growth</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Compliance: {partner.contractCompliance}%</span>
                  {partner.paymentStatus === 'overdue' && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">Payment overdue</span>
                  )}
                </div>
                <span className="text-gray-600">Response: {partner.responseTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}