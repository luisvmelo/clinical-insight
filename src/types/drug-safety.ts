export interface DrugSafetyRequest {
  specialPopulations: string[];
  riskConditions: string[];
  currentMedications: string[];
  prescriptionMedication: string;
}

export interface DrugInteraction {
  medication: string;
  severity: string;
  description: string;
}

export interface DrugSafetyResponse {
  status: 'LIBERADO' | 'PRECAUCAO' | 'BLOQUEADO';
  populationAlerts: string[];
  clinicalConditionAlerts: string[];
  drugInteractions: DrugInteraction[];
  finalRecommendation: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
