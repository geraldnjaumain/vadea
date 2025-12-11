import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--color-ink-blue)',
            color: '#9ca3af',
            padding: '64px 0',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="container mx-auto px-6">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}>
                    <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'white'
                    }}>
                        Vadea
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '32px',
                        alignItems: 'center'
                    }}>
                        <Link
                            to="/privacy"
                            style={{
                                color: '#9ca3af',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'white'}
                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            style={{
                                color: '#9ca3af',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'white'}
                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                        >
                            Terms of Service
                        </Link>
                    </div>

                    <div style={{ fontSize: '0.875rem' }}>
                        &copy; {new Date().getFullYear()} Vadea Inc. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
