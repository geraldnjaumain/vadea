import React from 'react';

const Footer = () => {
    return (
        <footer className="v4-footer" style={{ backgroundColor: 'var(--color-ink-blue)', color: '#9ca3af', padding: '64px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="v4-footer-container container mx-auto px-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="v4-logo" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                    Vadea
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                    &copy; {new Date().getFullYear()} Vadea Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
