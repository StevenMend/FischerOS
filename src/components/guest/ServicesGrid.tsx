// src/components/guest/ServicesGrid.tsx - PRO DESIGN VERSION
import React from 'react';
import { LucideIcon, Waves, Utensils, Flower, Car, Sparkles, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  borderColor: string;
  hoverShadow: string;
  page: string;
  stats: string;
  trending: boolean;
}

interface ServicesGridProps {
  services?: Service[];
  onNavigate: (page: string) => void;
}

export default function ServicesGrid({ services, onNavigate }: ServicesGridProps) {
  const defaultServices: Service[] = [
    {
      title: 'Tours & Adventures',
      description: 'Catamaran, ATV, Horseback & more',
      icon: Waves,
      color: 'blue',
      bgGradient: 'from-blue-50/80 via-blue-100/40 to-blue-50/20',
      borderColor: 'border-blue-200/60',
      hoverShadow: 'hover:shadow-blue-500/25',
      page: 'tours',
      stats: '12 available today',
      trending: true
    },
    {
      title: 'Restaurants',
      description: '8 dining venues • Real-time tables',
      icon: Utensils,
      color: 'orange',
      bgGradient: 'from-orange-50/80 via-orange-100/40 to-orange-50/20',
      borderColor: 'border-orange-200/60',
      hoverShadow: 'hover:shadow-orange-500/25',
      page: 'restaurants',
      stats: '6 available now',
      trending: false
    },
    {
      title: 'Spa & Wellness',
      description: 'Relaxation & rejuvenation',
      icon: Flower,
      color: 'emerald',
      bgGradient: 'from-emerald-50/80 via-emerald-100/40 to-emerald-50/20',
      borderColor: 'border-emerald-200/60',
      hoverShadow: 'hover:shadow-emerald-500/25',
      page: 'spa',
      stats: 'Next: 3:00 PM',
      trending: false
    },
    {
      title: 'Transportation',
      description: 'Airport, tours & local transport',
      icon: Car,
      color: 'purple',
      bgGradient: 'from-purple-50/80 via-purple-100/40 to-purple-50/20',
      borderColor: 'border-purple-200/60',
      hoverShadow: 'hover:shadow-purple-500/25',
      page: 'transport',
      stats: 'Available 24/7',
      trending: false
    }
  ];

  const data = services || defaultServices;

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Experiences</h2>
        <p className="text-gray-600">Discover everything {SITE_CONFIG.shortName} has to offer</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-item">
        {data.map((service, index) => (
          <div 
            key={index}
            onClick={() => onNavigate(service.page)}
            className={`group relative bg-gradient-to-br ${service.bgGradient} backdrop-blur-xl rounded-3xl p-8 border-2 ${service.borderColor} shadow-xl ${service.hoverShadow} hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.02] overflow-hidden card-interactive ripple-effect gpu-accelerated hover:border-opacity-80`}
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg"></div>
            </div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/40`}>
                  <service.icon className={`w-8 h-8 text-${service.color}-600`} />
                </div>
                {service.trending && (
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm text-red-600 px-3 py-2 rounded-full text-xs font-semibold border border-red-200/40 pulse-glow">
                    <Sparkles className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed mb-4">{service.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">{service.stats}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span className="text-sm font-medium">Explore</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}