import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Search, FileText, Plus } from 'lucide-react';
import '../styles/Dashboard.css';

const BottomNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, Icon, label }) => (
        <Link to={to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: isActive(to) ? 'var(--color-ink-blue)' : '#94a3b8' }}>
            <Icon size={24} />
            <div style={{ fontSize: '0.75rem', fontWeight: isActive(to) ? 700 : 500 }}>{label}</div>
        </Link>
    );

    return (
        <nav className="bottom-nav">
            <NavItem to="/app" Icon={Home} label="Home" />
            <NavItem to="/app/schedule" Icon={Calendar} label="Schedule" />
            <Link to="/app/ai-lab" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-ink-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: '-24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <Plus size={24} />
            </Link>
            <NavItem to="/app/vault" Icon={Search} label="Vault" />
            <NavItem to="/app/notes" Icon={FileText} label="Notes" />
        </nav>
    );
};

export default BottomNav;
