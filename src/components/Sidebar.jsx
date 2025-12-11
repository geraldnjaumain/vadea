import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Calendar, FileText, FolderClosed, Sparkles } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import '../styles/Dashboard.css';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <aside className="sidebar">
            <Link to="/app" className="sidebar-logo">Vadea</Link>

            <nav style={{ flex: 1 }}>
                <Link to="/app" className={`nav-item ${isActive('/app')}`}>
                    <LayoutGrid size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/app/schedule" className={`nav-item ${isActive('/app/schedule')}`}>
                    <Calendar size={20} />
                    <span>Schedule</span>
                </Link>
                <Link to="/app/notes" className={`nav-item ${isActive('/app/notes')}`}>
                    <FileText size={20} />
                    <span>Notes</span>
                </Link>
                <Link to="/app/vault" className={`nav-item ${isActive('/app/vault')}`}>
                    <FolderClosed size={20} />
                    <span>Vault</span>
                </Link>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '24px 0' }}></div>

                <Link to="/app/ai" className={`nav-item ${isActive('/app/ai')}`}>
                    <Sparkles size={20} />
                    <span>AI Lab</span>
                    <span style={{ fontSize: '0.625rem', backgroundColor: 'var(--color-electric-lime)', color: 'var(--color-ink-blue)', padding: '2px 6px', borderRadius: '99px', fontWeight: 700, marginLeft: 'auto' }}>NEW</span>
                </Link>

                <Link to="/app/settings" className={`nav-item ${isActive('/app/settings')}`} style={{ marginTop: 'auto' }}>
                    <LayoutGrid size={20} /> {/* Settings Icon Placeholder */}
                    <span>Settings</span>
                </Link>
            </nav>

            <div style={{ marginTop: '24px' }}>
                <ProfileDropdown />
            </div>
        </aside>
    );
};

export default Sidebar;
