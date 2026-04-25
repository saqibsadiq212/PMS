import { useState } from 'react';

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export function ConfirmDialog({
    title,
    message,
    confirmLabel = 'Confirm',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        setError(null);
        setSubmitting(true);
        try {
            await onConfirm();
        } catch (err) {
            console.error(err);
            setError('Action failed. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={submitting ? undefined : onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <p>{message}</p>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={submitting}
                        className="btn-danger"
                    >
                        {submitting ? 'Working...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}