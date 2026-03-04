import { ServiceRequest, CreateRequestDTO, UpdateRequestDTO } from './types';

export interface ServiceRequestsPort {
  getAll(): Promise<ServiceRequest[]>;
  getById(id: string): Promise<ServiceRequest>;
  create(request: CreateRequestDTO): Promise<ServiceRequest>;
  update(id: string, updates: UpdateRequestDTO): Promise<ServiceRequest>;
  delete(id: string): Promise<void>;
}
