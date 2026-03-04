// ============================================
// TOURS - HOOK REFACTORED (Phase A.1)
// Uses React Query instead of manual state
// ============================================

import { useState, useMemo } from 'react';
import { useToursQuery, useCreateBookingMutation } from '../queries';
import type { Tour, CreateTourBookingDTO } from '../api/types';

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
export const MEDICAL_OPTIONS = ['None', 'Heart Condition', 'Asthma', 'Diabetes', 'Allergies'];

export const useTours = () => {
  // Category filter state
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  // Modal state
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    skillLevel: 'Beginner',
    medicalConditions: [] as string[],
    emergencyContact: { name: '', phone: '' },
    insurance: false,
    waiverSigned: false,
    specialRequests: ''
  });

  // ========== REACT QUERY ==========
  
  // Get all tours
  const { 
    data: tours = [], 
    isLoading: loading, 
    error: queryError 
  } = useToursQuery();
  
  // Create booking mutation
  const createBookingMutation = useCreateBookingMutation();

  // ========== COMPUTED ==========
  
  const error = queryError ? (queryError as Error).message : null;
  
  // Filter tours by category
  const filteredTours = useMemo(() => {
    if (selectedFilter === 'All') return tours;
    return tours.filter(tour => tour.category === selectedFilter);
  }, [tours, selectedFilter]);
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tours.map(t => t.category)));
    return ['All', ...cats];
  }, [tours]);

  // ========== ACTIONS ==========
  
  const openModal = (tour: Tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTour(null);
    // Reset booking data
    setBookingData({
      guests: 2,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      skillLevel: 'Beginner',
      medicalConditions: [],
      emergencyContact: { name: '', phone: '' },
      insurance: false,
      waiverSigned: false,
      specialRequests: ''
    });
  };

  const updateBookingData = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedTour) return;

    // Validate
    if (!bookingData.waiverSigned) {
      throw new Error('You must sign the waiver to proceed');
    }

    if (selectedTour.insurance_required && !bookingData.insurance) {
      throw new Error('Insurance is required for this tour');
    }

    if (!bookingData.emergencyContact.name || !bookingData.emergencyContact.phone) {
      throw new Error('Emergency contact information is required');
    }

    // Prepare DTO
    const dto: CreateTourBookingDTO = {
      tour_id: selectedTour.id,
      booking_date: bookingData.date,
      time_slot: bookingData.time,
      adults: bookingData.guests,
      children: 0, // Could add children field later
      skill_level: bookingData.skillLevel,
      medical_conditions: bookingData.medicalConditions.filter(c => c !== 'None'),
      emergency_contact: bookingData.emergencyContact,
      insurance_confirmed: bookingData.insurance,
      waiver_signed: bookingData.waiverSigned,
      special_requests: bookingData.specialRequests || null,
    };

    // Submit via mutation
    await createBookingMutation.mutateAsync(dto);
    
    // Close modal on success
    closeModal();
  };

  return {
    // Data
    tours: filteredTours,
    allTours: tours,
    categories,
    loading,
    error,
    
    // Filter
    selectedFilter,
    setSelectedFilter,
    
    // Modal
    selectedTour,
    showModal,
    openModal,
    closeModal,
    
    // Booking form
    bookingData,
    updateBookingData,
    handleSubmit,
    isSubmitting: createBookingMutation.isPending,
  };
};
