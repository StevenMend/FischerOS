import React from 'react';
import { X, Building, Star } from 'lucide-react';
import { THEME_VARIANTS } from '../../../lib/theme/variants';

interface Partner {
  name: string;
  status: 'excellent' | 'good';
  tier: 'platinum' | 'gold' | 'silver';
  contractCompliance: number;
  commission: string;
  score: number;
  reliability: number;
  growth: string;
  responseTime: string;
  revenue: string;
  satisfaction: number;
  issues: number;
  paymentStatus: 'current' | 'overdue';
}

interface PartnerModalProps {
  partner: Partner | null;
  onClose: () => void;
}

export default function PartnerModal({ partner, onClose }: PartnerModalProps) {
  if (!partner) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full border border-white/50">
        <div className="p-6 border-b border-white/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Partner Performance
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{partner.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${THEME_VARIANTS.badge.status[partner.status]}`}>
                    {partner.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${THEME_VARIANTS.badge.tier[partner.tier]}`}>
                    {partner.tier}
                  </span>
                </div>
              </div>
            </div>
            {partner.paymentStatus === 'overdue' && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold border border-red-200">
                Payment Overdue
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-200/30">
              <div className="text-2xl font-bold text-blue-600">{partner.contractCompliance}%</div>
              <div className="text-xs text-gray-700 font-medium">Contract Compliance</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-200/30">
              <div className="text-2xl font-bold text-green-600">{partner.commission}</div>
              <div className="text-xs text-gray-700 font-medium">Commission Rate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/50">
              <div className="text-lg font-bold text-indigo-600">{partner.score}</div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/50">
              <div className="text-lg font-bold text-purple-600">{partner.reliability}%</div>
              <div className="text-xs text-gray-600">Reliability</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/50">
              <div className="text-lg font-bold text-green-600">{partner.growth}</div>
              <div className="text-xs text-gray-600">Growth</div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-white/50">
              <span className="text-sm text-gray-700 font-medium">Response Time</span>
              <span className="text-sm font-bold text-gray-900">{partner.responseTime}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-white/50">
              <span className="text-sm text-gray-700 font-medium">Total Revenue</span>
              <span className="text-sm font-bold text-green-600">{partner.revenue}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-white/50">
              <span className="text-sm text-gray-700 font-medium">Guest Satisfaction</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-gray-900">{partner.satisfaction}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-white/50">
              <span className="text-sm text-gray-700 font-medium">Active Issues</span>
              <span className={`text-sm font-bold ${partner.issues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {partner.issues}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}