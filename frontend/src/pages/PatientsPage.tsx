import { useEffect, useState } from 'react';
import { patientsApi } from '../api/patients';
import type { Patient, PatientFormData } from '../types/patient';
import { PatientForm } from '../components/PatientForm';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state: null = closed, undefined = creating, Patient = editing
    const [formMode, setFormMode] = useState<Patient | null | undefined>(null);

    // Delete state: null = no dialog, Patient = confirms deletion of patient
    const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadPatients = async () => {
            try {
                const data = await patientsApi.list();
                if (!cancelled) {
                    setPatients(data);
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError('Failed to load patients. Is the backend running?');
                    console.error(err);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadPatients();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleCreate = async (data: PatientFormData) => {
        const newPatient = await patientsApi.create(data);
        setPatients((prev) => [...prev, newPatient]);
        setFormMode(null);
    };

    const handleUpdate = async (data: PatientFormData) => {
        if (!formMode) return;
        const updated = await patientsApi.update(formMode.id, data);
        setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setFormMode(null);
    };

    const handleDelete = async () => {
        if (!deletingPatient) return;
        const id = deletingPatient.id;
        await patientsApi.remove(id);
        setPatients((prev) => prev.filter((p) => p.id !== id));
        setDeletingPatient(null);
    };

    if (loading) {
        return <div className="page"><p>Loading patients...</p></div>;
    }

    if (error) {
        return <div className="page"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    const formOpen = formMode !== null;
    const formPatient = formMode || undefined;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Patients</h1>
                <button onClick={() => setFormMode(undefined)}>+ Add Patient</button>
            </div>

            {patients.length === 0 ? (
                <p>No patients yet. Click + Add Patient button to create one.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Appointments</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.first_name} {patient.last_name}</td>
                            <td>{patient.date_of_birth}</td>
                            <td>{patient.email || '—'}</td>
                            <td>{patient.phone || '—'}</td>
                            <td>{patient.appointments.length}</td>
                            <td className="row-actions">
                            <button onClick={() => setFormMode(patient)}>Edit</button>
                            <button
                                onClick={() => setDeletingPatient(patient)}
                                className="btn-danger-link"
                            >
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {formOpen && (
                <PatientForm
                    patient={formPatient}
                    onSubmit={formPatient ? handleUpdate : handleCreate}
                    onCancel={() => setFormMode(null)}
                />
            )}

            {deletingPatient && (
                <ConfirmDialog
                    title="Delete Patient"
                    message={`Are you sure you want to delete ${deletingPatient.first_name} ${deletingPatient.last_name}?`}
                    confirmLabel="Delete"
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingPatient(null)}
                />
            )}
        </div>
    );
}