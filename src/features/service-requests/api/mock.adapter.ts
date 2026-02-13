import { ServiceRequestsPort } from './port';
import { ServiceRequest, CreateRequestDTO, UpdateRequestDTO } from './types';
import requestsData from '../../../data/seed/requests/service-requests.json';
import { logger } from '../../../core/utils/logger';

export class MockServiceRequestsAdapter implements ServiceRequestsPort {
  private requests: ServiceRequest[] = requestsData as ServiceRequest[];

  async getAll(): Promise<ServiceRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.requests].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: string): Promise<ServiceRequest> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const request = this.requests.find(r => r.id === id);
    if (!request) {
      throw new Error(`Request "${id}" not found`);
    }
    return request;
  }

  async create(dto: CreateRequestDTO): Promise<ServiceRequest> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      guestId: 'guest-123', // Mock guest
      guestName: 'John Doe',
      roomNumber: '304',
      ...dto,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: []
    };

    this.requests.unshift(newRequest);
    logger.info('ServiceRequests', 'Mock Request Created', newRequest);
    return newRequest;
  }

  async update(id: string, updates: UpdateRequestDTO): Promise<ServiceRequest> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Request "${id}" not found`);
    }

    const updated = {
      ...this.requests[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.requests[index] = updated;
    logger.info('ServiceRequests', 'Mock Request Updated', updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Request "${id}" not found`);
    }
    this.requests.splice(index, 1);
    logger.info('ServiceRequests', 'Mock Request Deleted', { id });
  }
}
