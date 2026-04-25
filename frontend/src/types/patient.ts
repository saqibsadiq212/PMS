export interface Clinician {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface Appointment {
  id: number;
  scheduled_at: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  clinicians: Clinician[];
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  appointments: Appointment[];
  created_at: string;
  updated_at: string;
}

// Form
export type PatientFormData = Omit<
  Patient,
  'id' | 'appointments' | 'created_at' | 'updated_at'
>;

// Pagination
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}