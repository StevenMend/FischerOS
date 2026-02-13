import { ToursPort } from './port';
import { RemoteToursAdapter } from './remote.adapter';

export function createToursRepository(): ToursPort {
  return new RemoteToursAdapter();
}

export type { 
  Tour, 
  TourBooking, 
  CreateTourBookingDTO, 
  UpdateBookingStatusDTO,
  TourFilters,
  TourBookingStats,
  BookingRequest,
  Booking 
} from './types';
