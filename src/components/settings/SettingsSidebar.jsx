import React from 'react';
import { User, Moon, Link, CreditCard, Bell } from 'lucide-react';

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'general', label: 'General', icon: <User size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Moon size={18} /> },
        { id: 'integrations', label: 'Integrations', icon: <Link size={18} /> },
        { id: 'plan', label: 'Plan & Billing', icon: <CreditCard size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    ];

    return (
        <div className="settings-sidebar">
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-ink-blue)', marginBottom: '24px' }} className="md-hidden-nav">Settings</h2>

            {menuItems.map((item) => (
                <div
                    key={item.id}
                    className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default SettingsSidebar;
