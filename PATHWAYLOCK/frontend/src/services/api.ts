import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = () => api.get('/api/health');

// Beneficiaries
export const createBeneficiary = (data: any) => api.post('/api/beneficiaries', data);
export const getBeneficiary = (id: number) => api.get(`/api/beneficiaries/${id}`);
export const listBeneficiaries = () => api.get('/api/beneficiaries');

// Profile extraction
export const extractProfile = (text: string, voiceTranscript?: string) =>
  api.post('/api/profile/extract', { text, voice_transcript: voiceTranscript });

// Opportunities
export const listOpportunities = (params?: any) => api.get('/api/opportunities', { params });
export const getOpportunity = (id: number) => api.get(`/api/opportunities/${id}`);
export const getCoverage = (occupation: string) => api.get(`/api/opportunities/coverage/${occupation}`);

// NSQF Pathways
export const listPathways = (occupation?: string) =>
  api.get('/api/nsqf/pathways', { params: { occupation } });
export const getPathway = (id: number) => api.get(`/api/nsqf/pathways/${id}`);

// Recommendations
export const generateRecommendation = (beneficiaryId: number) =>
  api.post('/api/recommendations/generate', { beneficiary_id: beneficiaryId });
export const getRecommendation = (id: number) => api.get(`/api/recommendations/${id}`);
export const listRecommendations = (params?: any) => api.get('/api/recommendations', { params });

// Counsellor
export const submitReview = (data: any) => api.post('/api/counsellor/review', data);
export const getPendingReviews = () => api.get('/api/counsellor/pending');
export const getReviewedRecommendations = (status?: string) =>
  api.get('/api/counsellor/reviewed', { params: { status } });
export const getAuditTrail = (entityId: number, entityType: string = 'recommendation') =>
  api.get(`/api/audit/${entityId}`, { params: { entity_type: entityType } });

// Sync
export const syncData = (entityType: string, data: any, clientTimestamp: string) =>
  api.post('/api/sync', { entity_type: entityType, data, client_timestamp: clientTimestamp });
