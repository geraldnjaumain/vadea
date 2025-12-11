import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import '../styles/Auth.css';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/app`
            }
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            // Auto redirect or show confirmation
            navigate('/app');
        }
    };

    return (
        <div className="auth-split">
            {/* LEFT SIDE: Brand Anchor */}
            <div className="auth-left">
                <Link to="/" className="auth-logo-text">Vadea</Link>
                <div className="auth-quote">
                    <p>"I used to drown in PDFs. Now I just ask Vadea to summarize them."</p>
                    <div className="auth-quote-author">— James, Pre-Med</div>
                </div>
            </div>

            {/* RIGHT SIDE: Action Zone */}
            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Create your Student OS</h1>
                        <p>Join Vadea and start studying smarter.</p>
                    </div>

                    {/* Social Auth */}
                    <div className="social-auth">
                        <button className="social-btn" onClick={handleGoogleLogin} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 20 }} />
                                    Continue with Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSignup}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    placeholder="Alex Student"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="alex@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    className="auth-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{showPassword ? "HIDE" : "SHOW"}</div>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
