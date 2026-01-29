import { DrugSafetyRequest, DrugSafetyResponse, ApiError } from '@/types/drug-safety';

// Configure your API base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function checkDrugSafety(request: DrugSafetyRequest): Promise<DrugSafetyResponse> {
  const response = await fetch(`${API_BASE_URL}/drug-safety/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `Erro ao consultar API: ${response.status} ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }

  return response.json();
}
