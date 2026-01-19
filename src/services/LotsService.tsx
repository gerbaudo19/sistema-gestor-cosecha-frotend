import { getAuthHeaders } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Lot {
  _id: string;
  code: string;
  name: string;
  cereal: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLotDto {
  code: string;
  name: string;
  cereal: string;
}

export interface UpdateLotDto {
  code?: string;
  name?: string;
  cereal?: string;
}

export interface LotsSearchParams {
  code?: string;
  name?: string;
  cereal?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  showDeleted?: boolean;
}

export interface LotsResponse {
  data: Lot[];
  total: number;
  page: number;
  limit: number;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error: ${response.statusText}`);
  }
  return response.json();
};

export const createLot = async (data: CreateLotDto): Promise<Lot> => {
  const response = await fetch(`${API_BASE_URL}/lots`, {
    method: 'POST',
    headers: getAuthHeaders('admin'),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateLot = async (id: string, data: UpdateLotDto): Promise<Lot> => {
  const response = await fetch(`${API_BASE_URL}/lots/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders('admin'),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteLot = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/lots/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders('admin'),
  });
  return handleResponse(response);
};

export const restoreLot = async (id: string): Promise<Lot> => {
  const response = await fetch(`${API_BASE_URL}/lots/${id}/restore`, {
    method: 'PATCH',
    headers: getAuthHeaders('admin'),
  });
  return handleResponse(response);
};

export const setActiveLot = async (code: string): Promise<Lot> => {
  const response = await fetch(`${API_BASE_URL}/lots/set-active/${code}`, {
    method: 'POST',
    headers: getAuthHeaders('admin'),
  });
  return handleResponse(response);
};

export const listLots = async (params: LotsSearchParams = {}): Promise<LotsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.code) searchParams.append('code', params.code);
  if (params.name) searchParams.append('name', params.name);
  if (params.cereal) searchParams.append('cereal', params.cereal);
  searchParams.append('page', String(params.page ?? 1));
  searchParams.append('limit', String(params.limit ?? 10));
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.order) searchParams.append('order', params.order);
  if (params.showDeleted) searchParams.append('showDeleted', String(params.showDeleted));

  const response = await fetch(`${API_BASE_URL}/lots?${searchParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders('admin'),
  });
  return handleResponse(response);
};
