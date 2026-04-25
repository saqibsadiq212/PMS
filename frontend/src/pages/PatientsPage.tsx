import { useEffect, useState } from 'react';
import { patientsApi } from '../api/patients';
import type { Patient } from '../types/patient';

export function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    setError('Failed to load patients.');
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

    if (loading) {
        return <div className="page"><p>Loading patients...</p></div>;
    }

    if (error) {
        return <div className="page"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div className="page">
        <h1>Patients</h1>
        {patients.length === 0 ? (
            <p>No patients yet.</p>
        ) : (
            <table>
            <thead>
                <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Appointments</th>
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
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}