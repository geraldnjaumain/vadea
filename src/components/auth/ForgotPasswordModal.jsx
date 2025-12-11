import React, { useState } from 'react';
import { X, Mail, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="forgot-password-overlay" onClick={onClose}>
            <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                {sent ? (
                    <div className="success-state">
                        <div className="success-icon">
                            <Check size={32} />
                        </div>
                        <h2>Check Your Email</h2>
                        <p>
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <button onClick={onClose} className="auth-button">
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <h2>Reset Password</h2>
                        <p className="modal-subtitle">
                            Enter your email address and we'll send you a link to reset your password
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="auth-input"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-button"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
