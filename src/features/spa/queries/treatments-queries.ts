import { useQuery } from '@tanstack/react-query';
import { spaAdapter } from '../api';
import { spaKeys } from './keys';
import type { SpaFilters } from '../types';

export function useTreatments(filters?: SpaFilters) {
  return useQuery({
    queryKey: [...spaKeys.treatments(), filters],
    queryFn: () => spaAdapter.getTreatments(filters),
  });
}

export function useTreatmentById(id: string) {
  return useQuery({
    queryKey: spaKeys.treatment(id),
    queryFn: () => spaAdapter.getTreatmentById(id),
    enabled: !!id,
  });
}

export function useTreatmentBySlug(slug: string) {
  return useQuery({
    queryKey: spaKeys.treatmentBySlug(slug),
    queryFn: () => spaAdapter.getTreatmentBySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedTreatments() {
  return useQuery({
    queryKey: spaKeys.featuredTreatments(),
    queryFn: () => spaAdapter.getFeaturedTreatments(),
  });
}

export function useTreatmentsByCategory(category: string) {
  return useQuery({
    queryKey: spaKeys.treatmentsByCategory(category),
    queryFn: () => spaAdapter.getTreatmentsByCategory(category),
    enabled: !!category,
  });
}