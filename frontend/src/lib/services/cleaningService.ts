import { api } from '../api';
import type { CleaningDetails } from '../types';

export const cleaningService = {
  // Get all cleaning tasks
  getAllCleaningTasks: async (): Promise<CleaningDetails[]> => {
    return api.get<CleaningDetails[]>('/api/cleaning');
  },

  // Get cleaning task by ID
  getCleaningTaskById: async (taskId: string): Promise<CleaningDetails> => {
    return api.get<CleaningDetails>(`/api/cleaning/${taskId}`);
  },

  // Get cleaning tasks by train ID
  getCleaningTasksByTrainId: async (trainId: string): Promise<CleaningDetails[]> => {
    return api.get<CleaningDetails[]>(`/api/cleaning/train/${trainId}`);
  },

  // Get active cleaning tasks
  getActiveCleaningTasks: async (): Promise<CleaningDetails[]> => {
    return api.get<CleaningDetails[]>('/api/cleaning/active');
  },

  // Get scheduled cleaning tasks for a date
  getScheduledCleaningTasks: async (date: string): Promise<CleaningDetails[]> => {
    return api.get<CleaningDetails[]>(`/api/cleaning/scheduled/${date}`);
  },

  // Get today's cleaning tasks
  getTodaysCleaningTasks: async (): Promise<CleaningDetails[]> => {
    return api.get<CleaningDetails[]>('/api/cleaning/today');
  },

  // Get due cleaning tasks
  getDueCleaningTasks: async (): Promise<CleaningDetails[]> => {
    return api.get<CleaningDetails[]>('/api/cleaning/due');
  },

  // Schedule daily cleaning
  scheduleDailyCleaning: async (): Promise<CleaningDetails[]> => {
    return api.post<CleaningDetails[]>('/api/cleaning/schedule-daily');
  },

  // Create new cleaning task
  createCleaningTask: async (task: Omit<CleaningDetails, 'taskId'>): Promise<CleaningDetails> => {
    return api.post<CleaningDetails>('/api/cleaning', task);
  },

  // Schedule cleaning for specific train
  scheduleCleaningForTrain: async (trainId: string, task: Partial<CleaningDetails>): Promise<CleaningDetails> => {
    return api.post<CleaningDetails>(`/api/cleaning/schedule-for-train/${trainId}`, task);
  },

  // Update cleaning task
  updateCleaningTask: async (taskId: string, task: Partial<CleaningDetails>): Promise<CleaningDetails> => {
    return api.put<CleaningDetails>(`/api/cleaning/${taskId}`, task);
  },

  // Start cleaning task
  startCleaningTask: async (taskId: string): Promise<CleaningDetails> => {
    return api.put<CleaningDetails>(`/api/cleaning/${taskId}/start`);
  },

  // Complete cleaning task
  completeCleaningTask: async (taskId: string): Promise<CleaningDetails> => {
    return api.put<CleaningDetails>(`/api/cleaning/${taskId}/complete`);
  },

  // Delete cleaning task
  deleteCleaningTask: async (taskId: string): Promise<void> => {
    return api.delete<void>(`/api/cleaning/${taskId}`);
  },
};
