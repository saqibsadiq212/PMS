import { apiClient } from './client';
import type { Patient, PatientFormData, PaginatedResponse } from '../types/patient';

export const patientsApi = {
    list: async (): Promise<Patient[]> => {
        const response = await apiClient.get<PaginatedResponse<Patient>>('/patients/');
        return response.data.results;
    },

    create: async (data: PatientFormData): Promise<Patient> => {
        const response = await apiClient.post<Patient>('/patients/', data);
        return response.data;
    },

    update: async (id: number, data: Partial<PatientFormData>): Promise<Patient> => {
        const response = await apiClient.patch<Patient>(`/patients/${id}/`, data);
        return response.data;
    },

    remove: async (id: number): Promise<void> => {
        await apiClient.delete(`/patients/${id}/`);
    },
};