import React from 'react';
import Sidebar from '../components/Sidebar'; // Main app sidebar
import BottomNav from '../components/BottomNav'; // Mobile nav
import TaskSidebar from '../components/schedule/TaskSidebar';
import '../styles/Dashboard.css'; // Re-use main layout styles
import '../styles/Schedule.css';

const ScheduleLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            {/* Desktop Main Sidebar */}
            <Sidebar />

            {/* Mobile Bottom Nav */}
            <BottomNav />

            {/* Main Content Area */}
            <main className="main-content" style={{ padding: 0 }}>
                {children}
            </main>
        </div>
    );
};

export default ScheduleLayout;
