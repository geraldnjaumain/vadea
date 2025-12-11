import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(250, 250, 250, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      zIndex: 1000
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        padding: '0 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logo.png"
            alt="Vadea Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #0F172A'
            }}
          />
          <div style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0F172A'
          }}>
            Vadea
          </div>
        </Link>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link
            to="/login"
            style={{
              color: '#475569',
              fontWeight: 500,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0F172A'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}
          >
            Login
          </Link>
          <Link
            to="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 28px',
              background: '#D4FF00',
              color: '#0F172A',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(212, 255, 0, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(212, 255, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px rgba(212, 255, 0, 0.35)';
            }}
          >
            Get Vadea Free
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

