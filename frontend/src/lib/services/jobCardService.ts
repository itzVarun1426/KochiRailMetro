import { api } from '../api';
import type { JobCard } from '../types';

export const jobCardService = {
  // Get all job cards
  getAllJobCards: async (): Promise<JobCard[]> => {
    return api.get<JobCard[]>('/api/jobcards');
  },

  // Get job card by ID
  getJobCardById: async (id: string): Promise<JobCard> => {
    return api.get<JobCard>(`/api/jobcards/${id}`);
  },

  // Get open job cards
  getOpenJobCards: async (): Promise<JobCard[]> => {
    return api.get<JobCard[]>('/api/jobcards/open');
  },

  // Get completed job cards
  getCompletedJobCards: async (): Promise<JobCard[]> => {
    // Backend has no /completed endpoint; fetch all and filter client-side
    const all = await api.get<JobCard[]>('/api/jobcards');
    return all.filter(j => j.status === 'Completed');
  },

  // Get critical job cards
  getCriticalJobCards: async (): Promise<JobCard[]> => {
    return api.get<JobCard[]>('/api/jobcards/critical');
  },

  // Get overdue job cards
  getOverdueJobCards: async (): Promise<JobCard[]> => {
    return api.get<JobCard[]>('/api/jobcards/overdue');
  },

  // Get job cards by train ID
  getJobCardsByTrainId: async (trainId: string): Promise<JobCard[]> => {
    return api.get<JobCard[]>(`/api/jobcards/train/${trainId}`);
  },

  // Get job cards by trainset ID
  getJobCardsByTrainsetId: async (trainsetId: string): Promise<JobCard[]> => {
    return api.get<JobCard[]>(`/api/jobcards/trainset/${trainsetId}`);
  },

  // Get job cards by team
  getJobCardsByTeam: async (teamName: string): Promise<JobCard[]> => {
    return api.get<JobCard[]>(`/api/jobcards/team/${teamName}`);
  },

  // Create new job card
  createJobCard: async (jobCard: Omit<JobCard, 'id'>): Promise<JobCard> => {
    return api.post<JobCard>('/api/jobcards', jobCard);
  },

  // Update job card
  updateJobCard: async (id: string, jobCard: Partial<JobCard>): Promise<JobCard> => {
    return api.put<JobCard>(`/api/jobcards/${id}`, jobCard);
  },

  // Close job card
  closeJobCard: async (id: string): Promise<JobCard> => {
    return api.put<JobCard>(`/api/jobcards/${id}/close`);
  },

  // Start job card
  startJobCard: async (id: string): Promise<JobCard> => {
    return api.put<JobCard>(`/api/jobcards/${id}/start`);
  },

  // Complete job card
  completeJobCard: async (id: string): Promise<JobCard> => {
    return api.put<JobCard>(`/api/jobcards/${id}/complete`);
  },

  // Create job card (backend entity shape)
  createJobCardEntity: async (payload: any) => {
    return api.post(`/api/jobcards`, payload);
  },
};
