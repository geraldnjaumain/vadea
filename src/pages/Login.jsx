import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import '../styles/Auth.css';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/app`
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/app');
        }
    };

    return (
        <div className="auth-split">
            {/* LEFT SIDE: Brand Anchor */}
            <div className="auth-left">
                <Link to="/" className="auth-logo-text">Vadea</Link>
                <div className="auth-quote">
                    <p>"Since using Vadea, I've stopped missing assignments. It's my second brain."</p>
                    <div className="auth-quote-author">— Sarah, Comp Sci Major</div>
                </div>
            </div>

            {/* RIGHT SIDE: Action Zone */}
            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Enter your details to access your notes.</p>
                    </div>

                    {/* Social Auth */}
                    <div className="social-auth">
                        <button className="social-btn" onClick={handleGoogleLogin} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
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

                    <form className="auth-form" onSubmit={handleLogin}>
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
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="auth-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    {/* Simple Eye Toggle */}
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{showPassword ? "HIDE" : "SHOW"}</div>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-wrapper">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn-auth-primary" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
