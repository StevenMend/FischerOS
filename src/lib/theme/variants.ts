// lib/theme/variants.ts
export const THEME_VARIANTS = {
  // Efficiency colors
  efficiency: {
    getColor: (efficiency: number): string => {
      if (efficiency >= 95) return 'text-green-600';
      if (efficiency >= 85) return 'text-blue-600';
      if (efficiency >= 75) return 'text-yellow-600';
      return 'text-red-600';
    },
    getGradient: (efficiency: number): string => {
      if (efficiency >= 95) return 'from-green-500 to-green-600';
      if (efficiency >= 85) return 'from-blue-500 to-blue-600';
      if (efficiency >= 75) return 'from-yellow-500 to-yellow-600';
      return 'from-red-500 to-red-600';
    }
  },

  // Badge styles
  badge: {
    performance: {
      exceptional: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      excellent: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      good: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      default: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    },
    tier: {
      platinum: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      gold: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
      silver: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
      default: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    },
    status: {
      optimal: 'bg-green-100 text-green-800',
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      attention: 'bg-yellow-100 text-yellow-800',
      high: 'bg-yellow-100 text-yellow-800',
      normal: 'bg-blue-100 text-blue-800',
      crisis: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    },
    heatMap: {
      optimal: 'bg-green-500',
      attention: 'bg-yellow-500',
      crisis: 'bg-red-500',
      default: 'bg-gray-500'
    }
  },

  // KPI colors
  kpi: {
    colors: {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      default: 'bg-gray-100 text-gray-600'
    },
    gradients: {
      blue: 'from-blue-500/10 via-blue-400/5 to-blue-600/10',
      green: 'from-green-500/10 via-green-400/5 to-green-600/10',
      purple: 'from-purple-500/10 via-purple-400/5 to-purple-600/10',
      yellow: 'from-yellow-500/10 via-yellow-400/5 to-yellow-600/10',
      default: 'from-gray-500/10 via-gray-400/5 to-gray-600/10'
    },
    progressBars: {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      default: 'from-gray-500 to-gray-600'
    }
  },

  // Restaurant status colors
  restaurants: {
    statusColors: {
      green: 'text-green-600 bg-green-100',
      orange: 'text-orange-600 bg-orange-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      default: 'text-gray-600 bg-gray-100'
    },
    operational: {
      getStatus: (avgLoad: number) => {
        if (avgLoad >= 90) return {
          status: 'high' as const,
          color: 'bg-red-100 text-red-800',
          label: 'High Demand'
        };
        if (avgLoad >= 75) return {
          status: 'medium' as const,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Moderate'
        };
        return {
          status: 'optimal' as const,
          color: 'bg-green-100 text-green-800',
          label: 'Optimal'
        };
      }
    }
  },

  // Tours
  tours: {
    difficulty: {
      Easy: 'text-green-600 bg-green-100',
      Moderate: 'text-orange-600 bg-orange-100',
      Hard: 'text-red-600 bg-red-100',
      default: 'text-gray-600 bg-gray-100'
    },
    equipment: {
      getStatus: (availability: number) => {
        if (availability >= 90) return {
          color: 'text-green-600 bg-green-100',
          label: 'Optimal'
        };
        if (availability >= 70) return {
          color: 'text-yellow-600 bg-yellow-100',
          label: 'Limited'
        };
        return {
          color: 'text-red-600 bg-red-100',
          label: 'Maintenance'
        };
      }
    },
    partnerStatus: {
      online: 'bg-green-500',
      busy: 'bg-yellow-500',
      offline: 'bg-gray-500',
      default: 'bg-gray-500'
    },
    weatherImpact: {
      getColor: (sensitivity: string, severity: string) => {
        if (severity === 'high' && sensitivity === 'high') return 'border-red-500 bg-red-50';
        if (severity === 'medium' && (sensitivity === 'high' || sensitivity === 'medium')) return 'border-yellow-500 bg-yellow-50';
        return '';
      }
    }
  },

  // Brand colors (semantic tokens — values come from CSS custom properties)
  brand: {
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    surface: 'var(--color-surface)',
    foreground: 'var(--color-foreground)',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },

  // Common CSS Classes
  common: {
    button: {
      primary: 'bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors shadow-sm',
      secondary: 'bg-accent-light text-primary hover:bg-accent hover:text-white',
      filter: 'px-4 py-2 rounded-lg font-medium transition-all duration-300'
    },
    card: {
      base: 'bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300',
      overlay: 'absolute top-4 right-4'
    },
    modal: {
      backdrop: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
      container: 'bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto',
      header: 'flex items-center justify-between p-6 border-b border-gray-200'
    },
    input: {
      base: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
    }
  }
} as const;

// Helper functions - TODAS EN UN SOLO LUGAR, SIN DUPLICACIONES
export const getEfficiencyColor = (efficiency: number) => 
  THEME_VARIANTS.efficiency.getColor(efficiency);

export const getEfficiencyGradient = (efficiency: number) => 
  THEME_VARIANTS.efficiency.getGradient(efficiency);

export const getPerformanceBadge = (performance: keyof typeof THEME_VARIANTS.badge.performance) => 
  THEME_VARIANTS.badge.performance[performance] || THEME_VARIANTS.badge.performance.default;

export const getTierBadge = (tier: keyof typeof THEME_VARIANTS.badge.tier) => 
  THEME_VARIANTS.badge.tier[tier] || THEME_VARIANTS.badge.tier.default;

export const getStatusBadge = (status: keyof typeof THEME_VARIANTS.badge.status) => 
  THEME_VARIANTS.badge.status[status] || THEME_VARIANTS.badge.status.default;

export const getHeatMapColor = (status: keyof typeof THEME_VARIANTS.badge.heatMap) => 
  THEME_VARIANTS.badge.heatMap[status] || THEME_VARIANTS.badge.heatMap.default;

export const getKpiColor = (color: keyof typeof THEME_VARIANTS.kpi.colors) => 
  THEME_VARIANTS.kpi.colors[color] || THEME_VARIANTS.kpi.colors.default;

export const getKpiGradient = (color: keyof typeof THEME_VARIANTS.kpi.gradients) => 
  THEME_VARIANTS.kpi.gradients[color] || THEME_VARIANTS.kpi.gradients.default;

export const getKpiProgressBar = (color: keyof typeof THEME_VARIANTS.kpi.progressBars) => 
  THEME_VARIANTS.kpi.progressBars[color] || THEME_VARIANTS.kpi.progressBars.default;

export const getStatusColor = (color: string) => 
  THEME_VARIANTS.restaurants.statusColors[color as keyof typeof THEME_VARIANTS.restaurants.statusColors] || 
  THEME_VARIANTS.restaurants.statusColors.default;

export const getOperationalStatus = (restaurant: { kitchenLoad: number; serverAvailability: number; tableRotation: number; }) => {
  const avgLoad = (restaurant.kitchenLoad + restaurant.serverAvailability + restaurant.tableRotation) / 3;
  return THEME_VARIANTS.restaurants.operational.getStatus(avgLoad);
};

export const getDifficultyColor = (difficulty: string) => 
  THEME_VARIANTS.tours.difficulty[difficulty as keyof typeof THEME_VARIANTS.tours.difficulty] || 
  THEME_VARIANTS.tours.difficulty.default;

export const getEquipmentStatus = (equipment: { available: number; total: number; }) => {
  const availability = (equipment.available / equipment.total) * 100;
  return THEME_VARIANTS.tours.equipment.getStatus(availability);
};

export const getPartnerStatus = (status: string) => 
  THEME_VARIANTS.tours.partnerStatus[status as keyof typeof THEME_VARIANTS.tours.partnerStatus] || 
  THEME_VARIANTS.tours.partnerStatus.default;

export const getWeatherImpactColor = (sensitivity: string, severity: string) => 
  THEME_VARIANTS.tours.weatherImpact.getColor(sensitivity, severity);