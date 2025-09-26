import { api } from '../api';
import type { Train } from '../types';

export const trainService = {
  // Get all trains
  getAllTrains: async (): Promise<Train[]> => {
    return api.get<Train[]>('/api/trains');
  },

  // Get train by ID
  getTrainById: async (id: string): Promise<Train> => {
    return api.get<Train>(`/api/trains/${id}`);
  },

  // Get train by train number
  getTrainByNumber: async (trainNumber: string): Promise<Train> => {
    return api.get<Train>(`/api/trains/number/${trainNumber}`);
  },

  // Get available trains
  getAvailableTrains: async (): Promise<Train[]> => {
    return api.get<Train[]>('/api/trains/available');
  },

  // Get trains in maintenance
  getMaintenanceTrains: async (): Promise<Train[]> => {
    return api.get<Train[]>('/api/trains/maintenance');
  },

  // Create new train
  createTrain: async (train: Omit<Train, 'id'>): Promise<Train> => {
    return api.post<Train>('/api/trains', train);
  },

  // Update train
  updateTrain: async (id: string, train: Partial<Train>): Promise<Train> => {
    return api.put<Train>(`/api/trains/${id}`, train);
  },

  // Update train status
  updateTrainStatus: async (id: string, status: string): Promise<Train> => {
    return api.put<Train>(`/api/trains/updateStatus/${id}?status=${status}`);
  },

  // Get maintenance due info
  getMaintenanceDue: async (id: string) => {
    return api.get(`/api/trains/${id}/maintenance-due`);
  },

  // Get cleaning due info
  getCleaningDue: async (id: string) => {
    return api.get(`/api/trains/${id}/cleaning-due`);
  },

  // Validate train for service
  validateForService: async (id: string) => {
    return api.get(`/api/trains/${id}/validate-for-service`);
  },

  // Get mileage balance
  getMileageBalance: async (id: string) => {
    return api.get(`/api/trains/${id}/mileage-balance`);
  },
};
