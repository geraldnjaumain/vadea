import React from 'react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import '../styles/Dashboard.css';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Bottom Nav */}
            <BottomNav />

            {/* Main Content */}
            <main className="main-content">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
