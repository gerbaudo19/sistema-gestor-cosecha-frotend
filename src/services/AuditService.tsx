import { getAuthHeaders } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface AuditEntry {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  lotId: string;
  userId?: string;
  changes?: Record<string, unknown>;
  createdAt: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error: ${response.statusText}`);
  }
  return response.json();
};

export const getAuditHistoryByLot = async (lotId: string): Promise<AuditEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/records/lot/${lotId}/history`, {
    method: 'GET',
    headers: getAuthHeaders('admin'),
  });
  return handleResponse(response);
};
