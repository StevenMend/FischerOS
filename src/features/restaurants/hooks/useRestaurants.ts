// ============================================
// RESTAURANTS HOOK - Refactored (Phase B.1)
// ============================================

import { useState, useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { logger } from '../../../core/utils/logger';
import {
  useRestaurants as useRestaurantsQuery,
  useCreateReservation,
} from '../queries';
import type { Restaurant, CreateRestaurantReservationDTO } from '../api/types';

export const CUISINES = [
  'All',
  'Italian',
  'Asian Fusion',
  'International',
  'Seafood',
  'Mexican',
  'Steakhouse',
  'Café',
  'Beach Bar',
];

export const OCCASIONS = [
  'Casual Dining',
  'Romantic Dinner',
  'Business Meeting',
  'Family Celebration',
  'Special Occasion',
  'Birthday',
  'Anniversary',
];

export const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00',
];

export const useRestaurants = () => {
  const { user } = useAuth();
  
  // ========== FILTERS ==========
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  
  // ========== MODAL STATE ==========
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // ========== RESERVATION FORM STATE ==========
  const [reservationData, setReservationData] = useState({
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    occasion: '',
    dietaryRestrictions: [] as string[],
    seatingPreference: '',
    specialRequests: '',
  });
  
  // ========== QUERIES ==========
  const { 
    data: restaurants = [], 
    isLoading: loading, 
    error: queryError,
    refetch 
  } = useRestaurantsQuery();
  
  const createReservationMutation = useCreateReservation();
  
  // ========== COMPUTED VALUES ==========
  const error = queryError ? (queryError as Error).message : null;
  
  const cuisines = useMemo(() => {
    if (!restaurants || restaurants.length === 0) {
      return CUISINES;
    }
    const uniqueCuisines = ['All', ...new Set(restaurants.map(r => r.cuisine))];
    return uniqueCuisines;
  }, [restaurants]);
  
  const filteredRestaurants = useMemo(() => {
    if (!restaurants || restaurants.length === 0) {
      return [];
    }
    if (selectedCuisine === 'All') {
      return restaurants;
    }
    return restaurants.filter(r => r.cuisine === selectedCuisine);
  }, [restaurants, selectedCuisine]);
  
  // ========== WEATHER (placeholder) ==========
  const weatherImpact = {
    affectedVenues: [] as string[],
  };
  
  // ========== MODAL HANDLERS ==========
  const handleReservation = (restaurant: Restaurant) => {
    logger.debug('Restaurants', 'Opening reservation modal', restaurant.name);
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };
  
  const closeModal = () => {
    logger.debug('Restaurants', 'Closing reservation modal');
    setShowModal(false);
    setSelectedRestaurant(null);
    resetReservationData();
  };
  
  const resetReservationData = () => {
    setReservationData({
      guests: 2,
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      occasion: '',
      dietaryRestrictions: [],
      seatingPreference: '',
      specialRequests: '',
    });
  };
  
  const updateReservationData = (field: string, value: any) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // ========== SUBMIT RESERVATION ==========
  const submitReservation = async () => {
    if (!selectedRestaurant) {
      throw new Error('No restaurant selected');
    }
    
    const dto: CreateRestaurantReservationDTO = {
      restaurant_id: selectedRestaurant.id,
      reservation_date: reservationData.date,
      time_slot: reservationData.time,
      party_size: reservationData.guests,
      occasion: reservationData.occasion || undefined,
      dietary_restrictions: reservationData.dietaryRestrictions.length > 0 
        ? reservationData.dietaryRestrictions 
        : undefined,
      seating_preference: reservationData.seatingPreference || undefined,
      special_requests: reservationData.specialRequests || undefined,
    };
    
    logger.info('Restaurants', 'Submitting reservation', dto);
    
    await createReservationMutation.mutateAsync(dto);
    
    closeModal();
  };
  
  // ========== RETURN ==========
  return {
    // Data
    restaurants,
    allRestaurants: restaurants,
    filteredRestaurants,
    
    // Filters
    selectedCuisine,
    setSelectedCuisine,
    cuisines,
    
    // Modal state
    selectedRestaurant,
    showModal,
    isModalOpen: showModal && selectedRestaurant !== null,
    handleReservation,
    closeModal,
    
    // Reservation data
    reservationData,
    setReservationData,
    updateReservationData,
    resetReservationData,
    
    // Actions
    submitReservation,
    isSubmitting: createReservationMutation.isPending,
    
    // Status
    loading,
    error,
    refetch,
    
    // Weather (legacy)
    weatherImpact,
    
    // Constants
    occasions: OCCASIONS,
    timeSlots: TIME_SLOTS,
  };
};
