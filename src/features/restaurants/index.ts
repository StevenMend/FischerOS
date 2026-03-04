// Main exports
export { useRestaurants, OCCASIONS, DIETARY_OPTIONS, SEATING_OPTIONS } from './hooks/useRestaurants';
export { createRestaurantsRepository } from './api';
export type { Restaurant, ReservationRequest, Reservation } from './api';

// Components
export * from './components';

// Page
export { default as RestaurantsPage } from './pages/RestaurantsPage';
