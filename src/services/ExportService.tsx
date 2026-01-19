import { getAdminToken } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const exportLotToExcel = async (lotId: string, lotCode: string): Promise<void> => {
  const token = getAdminToken();
  
  const response = await fetch(`${API_BASE_URL}/records/export/lot/${lotId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error al exportar');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lote_${lotCode}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
