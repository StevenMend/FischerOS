import { RestaurantsPort } from './port';
import { Restaurant, ReservationRequest, Reservation } from './types';
import restaurantsData from '../../../data/seed/restaurants/venues.json';
import { logger } from '../../../core/utils/logger';

/**
 * MockRestaurantsAdapter - Reads from local seed data
 */
export class MockRestaurantsAdapter implements RestaurantsPort {
  private restaurants: Restaurant[] = restaurantsData as Restaurant[];

  async getAll(): Promise<Restaurant[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.restaurants;
  }

  async getById(name: string): Promise<Restaurant> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const restaurant = this.restaurants.find(r => r.name === name);
    if (!restaurant) {
      throw new Error(`Restaurant "${name}" not found`);
    }
    return restaurant;
  }

  async createReservation(request: ReservationRequest): Promise<Reservation> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const reservation: Reservation = {
      ...request,
      id: `res-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    logger.info('RestaurantsAdapter', 'Mock Reservation Created', reservation);
    return reservation;
  }
}
