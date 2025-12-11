import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, quote, author }) => {
    return (
        <div className="auth-split">
            {/* Left Side - Brand Anchor */}
            <div className="auth-left">
                <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>
                    Vadea
                </Link>

                <div style={{ maxWidth: '480px' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '24px' }}>
                        "{quote}"
                    </p>
                    <p style={{ opacity: 0.8, fontSize: '1.125rem' }}>— {author}</p>
                </div>

                <div style={{ fontSize: '0.875rem', opacity: 0.6 }}>
                    © {new Date().getFullYear()} Vadea Inc.
                </div>
            </div>

            {/* Right Side - Action Zone */}
            <div className="auth-right">
                <div className="auth-container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
