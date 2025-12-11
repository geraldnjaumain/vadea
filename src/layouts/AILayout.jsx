import React, { useState } from 'react';
import AISidebar from '../components/ai/AISidebar';
import Sidebar from '../components/Sidebar'; // Main Nav
import BottomNav from '../components/BottomNav'; // Mobile Nav
import { Menu } from 'lucide-react';
import '../styles/Dashboard.css'; // For basic layout structure
import '../styles/AILab.css';

const AILayout = ({ children }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout">
            {/* Desktop Main Sidebar (Mini Mode?) */}
            <div className='md-hidden'>
                <Sidebar />
            </div>
            <BottomNav />

            <div className="ai-layout" style={{ flex: 1, overflow: 'hidden' }}>
                {/* AI Context Sidebar - Toggleable on mobile */}
                <div className={`ai-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
                    <AISidebar activeFile={null} onClose={() => setIsMobileSidebarOpen(false)} />
                </div>

                {/* Mobile Overlay */}
                {isMobileSidebarOpen && (
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}

                {/* Main Chat Stage */}
                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {/* Mobile Header */}
                    <div className="md-visible" style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', display: 'none', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => setIsMobileSidebarOpen(true)} style={{ background: 'none', border: 'none' }}>
                            <Menu size={20} />
                        </button>
                        <span style={{ fontWeight: 600 }}>Lab Partner</span>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default AILayout;
