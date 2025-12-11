import React from 'react';
import { AlertTriangle } from 'lucide-react';
import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-overlay" onClick={onClose}>
            <div className="confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="confirmation-header">
                    <div className="confirmation-title">
                        {isDanger && <AlertTriangle size={24} color="#ef4444" />}
                        {title}
                    </div>
                </div>

                <div className="confirmation-message">
                    {message}
                </div>

                <div className="confirmation-actions">
                    <button className="btn-confirm-cancel" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className={isDanger ? "btn-confirm-danger" : "btn-confirm-primary"}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
