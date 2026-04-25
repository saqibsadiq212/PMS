import { useState, type FormEvent } from 'react';
import type { Patient, PatientFormData } from '../types/patient';

interface PatientFormProps {
    patient?: Patient;
    onSubmit: (data: PatientFormData) => Promise<void>;
    onCancel: () => void;
}

const emptyForm: PatientFormData = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    email: '',
    phone: '',
};

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
    const [formData, setFormData] = useState<PatientFormData>(
        patient
        ? {
            first_name: patient.first_name,
            last_name: patient.last_name,
            date_of_birth: patient.date_of_birth,
            email: patient.email,
            phone: patient.phone,
            }
        : emptyForm
    );
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEdit = Boolean(patient);

    const handleChange = (field: keyof PatientFormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await onSubmit(formData);
        } catch (err: unknown) {
            console.error(err);
            setError('Failed to save patient. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isEdit ? 'Edit Patient' : 'Add Patient'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label htmlFor="first_name">First Name *</label>
                        <input
                            id="first_name"
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={handleChange('first_name')}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="last_name">Last Name *</label>
                        <input
                            id="last_name"
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={handleChange('last_name')}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="date_of_birth">Date of Birth *</label>
                        <input
                            id="date_of_birth"
                            type="date"
                            required
                            value={formData.date_of_birth}
                            onChange={handleChange('date_of_birth')}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}