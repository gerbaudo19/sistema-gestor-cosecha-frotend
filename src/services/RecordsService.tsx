import { getAuthHeaders } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface RecordEntry {
  _id?: string;
  orderNumber: number;
  date: string;
  kilograms: number;
  bolsonNumber?: number;
  loteNumber?: string;
  truckPlate?: string;
  truckDriver?: string;
  tolvero?: string;
  controller?: string;
  cereal?: string;
  lotId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecordDto {
  date: string;
  kilograms: number;
  bolsonNumber?: number;
  loteNumber?: string;
  truckPlate?: string;
  truckDriver?: string;
  tolvero?: string;
  controller?: string;
  cereal?: string;
}

export interface SearchFilters {
  orderNumber?: number;
  truckPlate?: string;
  truckDriver?: string;
  cereal?: string;
  dateFrom?: string;
  dateTo?: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error: ${response.statusText}`);
  }
  return response.json();
};

export const createRecord = async (data: CreateRecordDto): Promise<RecordEntry> => {
  const response = await fetch(`${API_BASE_URL}/records`, {
    method: 'POST',
    headers: getAuthHeaders('lot'),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateRecord = async (id: string, data: CreateRecordDto): Promise<RecordEntry> => {
  const response = await fetch(`${API_BASE_URL}/records/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders('lot'),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteRecord = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/records/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders('lot'),
  });
  return handleResponse(response);
};

export const listRecordsByLot = async (): Promise<RecordEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/records/lot`, {
    method: 'GET',
    headers: getAuthHeaders('lot'),
  });
  return handleResponse(response);
};

export const listRecordsByLotAndDay = async (date: string): Promise<RecordEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/records/lot/day?date=${date}`, {
    method: 'GET',
    headers: getAuthHeaders('lot'),
  });
  return handleResponse(response);
};

export const searchRecords = async (filters: SearchFilters): Promise<RecordEntry[]> => {
  const params = new URLSearchParams();

  if (filters.orderNumber) params.append('orderNumber', String(filters.orderNumber));
  if (filters.truckPlate) params.append('truckPlate', filters.truckPlate);
  if (filters.truckDriver) params.append('truckDriver', filters.truckDriver);
  if (filters.cereal) params.append('cereal', filters.cereal);
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);

  const response = await fetch(`${API_BASE_URL}/records/search?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders('lot'),
  });
  return handleResponse(response);
};
