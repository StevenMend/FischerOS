// src/config/site.ts - Real Tamarindo Diriá Configuration
export const SITE_CONFIG = {
  // Identidad Oficial del Resort
  name: 'Tamarindo Diriá Beach Resort',
  shortName: 'Tamarindo Diriá',
  tagline: 'Costa Rica Beach Resort',
  description: 'Luxury beachfront resort in Tamarindo, Costa Rica',
  version: '1.0.0',
  location: 'Calle Central, Provincia de Guanacaste, Tamarindo, Costa Rica',
  
  // Contact Information (Real)
  contact: {
    phone: '+506 2653-0031',
    email: 'info@tamarindodiria.com',
    website: 'https://tamarindodiria.com'
  },
  
  // Properties (manteniendo compatibilidad con código existente)
  properties: [
    'Tamarindo Diriá Beach Resort',
    'Guanacaste Resort', 
    'Manuel Antonio'
  ],
  
  // Resort Areas (Based on real resort map)
  areas: {
    sunsetVillage: 'Sunset Village',
    tropicana: 'Tropicana (Adults Only)',
    familyPoolView: 'Family Pool View',
    grandBoulevard: 'Grand Boulevard'
  },
  
  // Real Restaurants
  restaurants: [
    'El Pelícano Restaurant',
    'Brisa Mar Restaurant', 
    'Nari Restaurant',
    'Venezia',
    'Flying Bull Sports Bar',
    'Wet Bar',
    'Lounge Bar',
    'Mixcoa Event Restaurant'
  ],
  
  // Real Facilities  
  facilities: [
    'Garden Spa Tamarindo Diria',
    'Casino Diria',
    'Tour Desk', 
    'Main Front Desk',
    'Gym',
    'Tennis Court',
    'Kids Club',
    'Amphitheater',
    'Medical Clinic'
  ],
  
  // Departments - UPDATED TO MATCH DATABASE
  departments: [
    'Concierge',
    'Food & Beverage',
    'Front Desk',
    'General Services',
    'Housekeeping',
    'Maintenance',
    'Spa',
    'Tours & Activities',
    'Transportation'
  ],
  
  // Session Configuration
  sessionTimeouts: {
    guest: 24 * 60 * 60 * 1000, // 24 hours
    staff: 8 * 60 * 60 * 1000,  // 8 hours  
    admin: 4 * 60 * 60 * 1000   // 4 hours
  },
  
  // Environment
  environment: import.meta.env.MODE || 'development',
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Feature Flags
  features: {
    realTimeUpdates: true,
    weatherIntegration: true,
    loyaltyProgram: true,
    tourBooking: true,
    spaBooking: true,
    restaurantReservations: true,
    conciergeServices: true,
    transportation: true
  },
  
  // Brand colors (defaults — override via CSS custom properties per tenant)
  colors: {
    primary: '#4a90a4',
    primaryDark: '#3a7285',
    accent: '#d4af37',
    accentDark: '#b8941f',
    surface: '#f9fafb',
    foreground: '#8b7355',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  
  // Business Rules
  business: {
    maxGuestsPerReservation: 12,
    maxGuestsPerTour: 20,
    advanceBookingDays: 90,
    cancellationHours: 24,
    escalationMinutes: 30,
    loyaltyTiers: ['Standard', 'Gold', 'Platinum']
  },
  
  // Resort Stats (Real)
  stats: {
    totalRooms: 300,
    restaurantCount: 8,
    tourOptions: '60+',
    conciergeHours: '24/7',
    beachfrontLocation: true,
    adultOnlyArea: true,
    familyFriendly: true
  }
} as const;