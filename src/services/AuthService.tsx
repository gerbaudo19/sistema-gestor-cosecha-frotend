const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LotLoginRequest {
  code: string;
}

export interface LotLoginResponse {
  lotToken: string;
  lotId: string;
  expiresIn: string;
}

export const adminLogin = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return response.json();
};

export const lotLogin = async (lotCode: LotLoginRequest): Promise<LotLoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/lot-auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lotCode),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Código inválido o lote inactivo');
  }

  return response.json();
};

export const saveAdminToken = (token: string) => {
  localStorage.setItem('admin_token', token);
};

export const saveLotToken = (token: string, lotId: string) => {
  localStorage.setItem('lot_token', token);
  localStorage.setItem('lot_id', lotId);
};

export const getAdminToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

export const getLotToken = (): string | null => {
  return localStorage.getItem('lot_token');
};

export const getLotId = (): string | null => {
  return localStorage.getItem('lot_id');
};

export const clearAdminToken = () => {
  localStorage.removeItem('admin_token');
};

export const clearLotToken = () => {
  localStorage.removeItem('lot_token');
  localStorage.removeItem('lot_id');
};

export const isAdminAuthenticated = (): boolean => {
  return !!getAdminToken();
};

export const isLotAuthenticated = (): boolean => {
  return !!getLotToken();
};

export const getAuthHeaders = (tokenType: 'admin' | 'lot' = 'lot'): HeadersInit => {
  const token = tokenType === 'admin' ? getAdminToken() : getLotToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};
