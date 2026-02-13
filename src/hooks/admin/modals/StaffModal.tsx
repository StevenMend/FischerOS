import React from 'react';
import { X, User } from 'lucide-react';
import { THEME_VARIANTS } from '../../../lib/theme/variants';

interface StaffMember {
  name: string;
  department: string;
  rating: number;
  efficiency: number;
  revenue: string;
  streak: number;
  growth: string;
  certifications: string[];
  trainingNeeds: string[];
  schedule: string;
  performance: 'exceptional' | 'excellent' | 'good';
}

interface StaffModalProps {
  staffMember: StaffMember | null;
  onClose: () => void;
}

export default function StaffModal({ staffMember, onClose }: StaffModalProps) {
  if (!staffMember) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full border border-white/50">
        <div className="p-6 border-b border-white/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Staff Performance Details
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{staffMember.name}</h4>
                <p className="text-sm text-gray-600 font-medium">{staffMember.department}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${THEME_VARIANTS.badge.performance[staffMember.performance]}`}>
                {staffMember.performance}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-200/30">
              <div className="text-2xl font-bold text-blue-600">{staffMember.efficiency}%</div>
              <div className="text-xs text-gray-700 font-medium">Efficiency</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-200/30">
              <div className="text-2xl font-bold text-green-600">{staffMember.revenue}</div>
              <div className="text-xs text-gray-700 font-medium">Revenue Generated</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/50">
              <div className="text-lg font-bold text-yellow-600">{staffMember.rating}</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/50">
              <div className="text-lg font-bold text-purple-600">{staffMember.streak}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg border border-white/50">
              <div className="text-lg font-bold text-green-600">{staffMember.growth}</div>
              <div className="text-xs text-gray-600">Growth</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="font-bold text-gray-900 mb-3">Certifications:</h5>
            <div className="flex flex-wrap gap-2">
              {staffMember.certifications.map((cert, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {cert}
                </span>
              ))}
            </div>
          </div>
          
          {staffMember.trainingNeeds.length > 0 && (
            <div className="mb-6">
              <h5 className="font-bold text-gray-900 mb-3">Training Recommendations:</h5>
              <ul className="text-sm text-gray-700 space-y-2">
                {staffMember.trainingNeeds.map((need, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">{need}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mb-6">
            <h5 className="font-bold text-gray-900 mb-3">Schedule Optimization:</h5>
            <div className={`p-3 rounded-lg ${
              staffMember.schedule === 'Optimal' ? 'bg-green-100 text-green-700' :
              staffMember.schedule === 'Underutilized' ? 'bg-blue-100 text-blue-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              <p className="text-sm font-bold">{staffMember.schedule}</p>
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