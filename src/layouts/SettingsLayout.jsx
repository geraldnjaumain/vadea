import React from 'react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import '../styles/Dashboard.css';
import '../styles/Settings.css';

const SettingsLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <BottomNav />

            <div style={{ flex: 1, backgroundColor: 'white' }}>
                {children}
            </div>
        </div>
    );
};

export default SettingsLayout;
