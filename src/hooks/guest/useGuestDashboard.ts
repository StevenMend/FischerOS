// src/hooks/guest/useGuestDashboard.ts - VERSIÓN ORIGINAL QUE FUNCIONA
import { useState, useMemo } from 'react';
import { logger } from '../../core/utils/logger';
import { 
  Sun, CloudRain, Wind, Calendar, Crown, Star, Gift, 
  Waves, Utensils, Flower, Car, Phone, MessageSquare, 
  Camera, Coffee 
} from 'lucide-react';

export const useGuestDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');

  // Guest information
  const guestInfo = useMemo(() => ({
    name: 'Maria Rodriguez',
    room: '304',
    tier: 'Gold',
    email: 'maria.rodriguez@email.com',
    phone: '+506 8888-9999',
    checkIn: '2024-01-15',
    checkOut: '2024-01-22',
    adults: 2,
    children: 1
  }), []);

  // Weather data with enhanced visuals
  const weather = useMemo(() => ({
    current: {
      temp: 28,
      condition: 'Sunny',
      icon: Sun,
      humidity: 65,
      windSpeed: 12,
      uvIndex: 8
    },
    forecast: [
      { time: '2PM', temp: 30, icon: Sun, condition: 'Sunny' },
      { time: '4PM', temp: 29, icon: CloudRain, condition: 'Light Rain' },
      { time: '6PM', temp: 26, icon: CloudRain, condition: 'Rain' },
      { time: '8PM', temp: 24, icon: Wind, condition: 'Windy' }
    ]
  }), []);

  // Enhanced KPIs with trend indicators
  const kpis = useMemo(() => [
    {
      title: 'Active Bookings',
      value: '3',
      trend: '+1',
      trendDirection: 'up' as const,
      icon: Calendar,
      color: 'blue',
      bgGradient: 'from-blue-50/90 via-blue-100/50 to-white/80',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Loyalty Points',
      value: '2,450',
      trend: '+150',
      trendDirection: 'up' as const,
      icon: Crown,
      color: 'amber',
      bgGradient: 'from-amber-50/90 via-amber-100/50 to-white/80',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Satisfaction',
      value: '4.9/5',
      trend: '+0.2',
      trendDirection: 'up' as const,
      icon: Star,
      color: 'emerald',
      bgGradient: 'from-emerald-50/90 via-emerald-100/50 to-white/80',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Savings',
      value: '$340',
      trend: '+$85',
      trendDirection: 'up' as const,
      icon: Gift,
      color: 'purple',
      bgGradient: 'from-purple-50/90 via-purple-100/50 to-white/80',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600'
    }
  ], [selectedTimeframe]);

  // Loyalty information
  const loyalty = useMemo(() => ({
    points: 2450,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsToNext: 550,
    benefits: [
      'Priority booking',
      'Special rates',
      'Exclusive experiences',
      'Late checkout',
      'Welcome amenities'
    ],
    tierProgress: 81.5
  }), []);

  // Enhanced service cards
  const services = useMemo(() => [
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
      trending: true,
      availability: 'high',
      nextAvailable: '10:00 AM',
      price: 'From $75'
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
      trending: false,
      availability: 'medium',
      nextAvailable: '7:00 PM',
      price: 'Reservations recommended'
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
      trending: false,
      availability: 'low',
      nextAvailable: '3:00 PM',
      price: 'From $45'
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
      trending: false,
      availability: 'high',
      nextAvailable: 'Immediate',
      price: 'From $15'
    }
  ], []);

  // Quick actions with glassmorphism
  const quickActions = useMemo(() => [
    { 
      icon: Phone, 
      label: 'Call Concierge', 
      color: 'text-blue-600', 
      bg: 'bg-blue-500/10',
      action: () => window.open('tel:+50626530001'),
      available: true
    },
    { 
      icon: MessageSquare, 
      label: 'Chat Support', 
      color: 'text-green-600', 
      bg: 'bg-green-500/10',
      action: () => logger.debug('GuestDashboard', 'Open chat'),
      available: true
    },
    { 
      icon: Camera, 
      label: 'Photo Request', 
      color: 'text-purple-600', 
      bg: 'bg-purple-500/10',
      action: () => logger.debug('GuestDashboard', 'Photo request'),
      available: true
    },
    { 
      icon: Coffee, 
      label: 'Room Service', 
      color: 'text-amber-600', 
      bg: 'bg-amber-500/10',
      action: () => logger.debug('GuestDashboard', 'Room service'),
      available: true
    }
  ], []);

  // Notifications data
  const notifications = useMemo(() => ({
    unreadCount: 3,
    items: [
      { 
        id: '1',
        title: 'Catamaran Tour Confirmed', 
        message: 'Tomorrow 5:00 PM • 4 guests', 
        time: '5 min ago', 
        type: 'success' as const,
        read: false
      },
      { 
        id: '2',
        title: 'Weather Update', 
        message: 'Light rain expected 4-6 PM', 
        time: '15 min ago', 
        type: 'warning' as const,
        read: false
      },
      { 
        id: '3',
        title: 'Loyalty Points Earned', 
        message: '+150 points from recent booking', 
        time: '1 hour ago', 
        type: 'info' as const,
        read: false
      },
      { 
        id: '4',
        title: 'Spa Appointment Reminder', 
        message: 'Couples massage at 3:00 PM today', 
        time: '2 hours ago', 
        type: 'info' as const,
        read: true
      },
      { 
        id: '5',
        title: 'Restaurant Recommendation', 
        message: 'Try our new sushi menu at Matiss', 
        time: '1 day ago', 
        type: 'info' as const,
        read: true
      }
    ]
  }), []);

  // Active bookings
  const bookings = useMemo(() => [
    {
      id: 'book-1',
      title: 'Catamaran Sunset Tour',
      date: '2024-01-16',
      time: '5:00 PM',
      guests: 4,
      status: 'confirmed',
      location: 'Tamarindo Beach',
      price: '$300',
      includes: ['Transportation', 'Drinks', 'Snacks'],
      cancellable: true
    },
    {
      id: 'book-2', 
      title: 'Couples Spa Treatment',
      date: '2024-01-17',
      time: '3:00 PM',
      guests: 2,
      status: 'confirmed',
      location: 'Spa Diriá',
      price: '$180',
      includes: ['Full body massage', 'Aromatherapy'],
      cancellable: true
    },
    {
      id: 'book-3',
      title: 'Dinner at El Pelícano',
      date: '2024-01-18',
      time: '7:30 PM',
      guests: 3,
      status: 'pending',
      location: 'El Pelícano Restaurant',
      price: '$120',
      includes: ['3-course meal', 'Wine pairing'],
      cancellable: true
    }
  ], []);

  return {
    // Guest data
    guestInfo,
    
    // Dashboard widgets
    weather,
    kpis,
    loyalty,
    services,
    quickActions,
    notifications,
    bookings,
    
    // UI state
    selectedTimeframe,
    setSelectedTimeframe,
  };
};