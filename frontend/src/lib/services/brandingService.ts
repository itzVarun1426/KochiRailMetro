import { api } from '../api';
import type { BrandingDetails } from '../types';

export const brandingService = {
  // Get all branding contracts
  getAllContracts: async (): Promise<BrandingDetails[]> => {
    return api.get<BrandingDetails[]>('/api/branding/contracts');
  },

  // Get contract by ID
  getContractById: async (id: string): Promise<BrandingDetails> => {
    return api.get<BrandingDetails>(`/api/branding/contracts/${id}`);
  },

  // Get active contracts
  getActiveContracts: async (): Promise<BrandingDetails[]> => {
    return api.get<BrandingDetails[]>('/api/branding/contracts/active');
  },

  // Create new contract
  createContract: async (contract: Omit<BrandingDetails, 'contractId'>): Promise<BrandingDetails> => {
    return api.post<BrandingDetails>('/api/branding/contracts', contract);
  },

  // Get all branding assignments
  getAllAssignments: async () => {
    return api.get('/api/branding/assignments');
  },

  // Get assignments by train ID
  getAssignmentsByTrainId: async (trainId: string) => {
    return api.get(`/api/branding/assignments/train/${trainId}`);
  },

  // Get assignments by contract ID
  getAssignmentsByContractId: async (contractId: string) => {
    return api.get(`/api/branding/assignments/contract/${contractId}`);
  },

  // Create new assignment
  createAssignment: async (assignment: any) => {
    return api.post('/api/branding/assignments', assignment);
  },

  // Assign train to contract
  assignTrainToContract: async (trainId: string, contractId: string) => {
    return api.post('/api/branding/assignments/assign-train', { trainId, contractId });
  },

  // Log exposure
  logExposure: async (exposureData: any) => {
    return api.post('/api/branding/log-exposure', exposureData);
  },

  // Get exposure report by contract
  getExposureReportByContract: async (contractId: string) => {
    return api.get(`/api/branding/exposure-report/contract/${contractId}`);
  },

  // Get exposure report by train
  getExposureReportByTrain: async (trainId: string) => {
    return api.get(`/api/branding/exposure-report/train/${trainId}`);
  },

  // Get contracts at risk
  getContractsAtRisk: async () => {
    return api.get('/api/branding/contracts/at-risk');
  },
};
