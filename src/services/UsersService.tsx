import { getAuthHeaders } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  createdAt: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error: ${response.statusText}`);
  }
  return response.json();
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders('admin'),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
