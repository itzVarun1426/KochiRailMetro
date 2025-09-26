import { api } from '../api';
import type { CertificateDetails } from '../types';
import type { ApiResponse } from '../api-types';

export const certificateService = {
  // Get all certificates
  getAllCertificates: async (): Promise<CertificateDetails[]> => {
    const response = await api.get<ApiResponse<CertificateDetails>>('/api/certificates');
    return response.value;
  },

  // Get certificate by ID
  getCertificateById: async (id: string): Promise<CertificateDetails> => {
    return api.get<CertificateDetails>(`/api/certificates/${id}`);
  },

  // Get certificates by train ID
  getCertificatesByTrainId: async (trainId: string): Promise<CertificateDetails[]> => {
    return api.get<CertificateDetails[]>(`/api/certificates/train/${trainId}`);
  },

  // Get expired certificates
  getExpiredCertificates: async (): Promise<CertificateDetails[]> => {
    const response = await api.get<ApiResponse<CertificateDetails>>('/api/certificates/expired');
    return response.value;
  },

  // Get certificates expiring soon
  getExpiringSoonCertificates: async (): Promise<CertificateDetails[]> => {
    const response = await api.get<ApiResponse<CertificateDetails>>('/api/certificates/expiring-soon');
    return response.value;
  },

  // Check if train has valid certificate
  isTrainCertificateValid: async (trainId: string): Promise<boolean> => {
    return api.get<boolean>(`/api/certificates/train/${trainId}/valid`);
  },

  // Get certificate status for train
  getTrainCertificateStatus: async (trainId: string) => {
    return api.get(`/api/certificates/train/${trainId}/status`);
  },

  // Create new certificate
  createCertificate: async (certificate: Omit<CertificateDetails, 'certificateId'>): Promise<CertificateDetails> => {
    return api.post<CertificateDetails>('/api/certificates', certificate);
  },

  // Create certificate with backend entity shape (more permissive)
  createCertificateEntity: async (payload: any) => {
    return api.post('/api/certificates', payload);
  },

  // Update certificate
  updateCertificate: async (id: string, certificate: Partial<CertificateDetails>): Promise<CertificateDetails> => {
    return api.put<CertificateDetails>(`/api/certificates/${id}`, certificate);
  },

  // Revoke certificate
  revokeCertificate: async (id: string): Promise<CertificateDetails> => {
    return api.put<CertificateDetails>(`/api/certificates/${id}/revoke`);
  },

  // Delete certificate
  deleteCertificate: async (id: string): Promise<void> => {
    return api.delete<void>(`/api/certificates/${id}`);
  },
};
