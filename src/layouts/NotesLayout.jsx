import React, { useState } from 'react';
import NotesSidebar from '../components/notes/NotesSidebar';
import AISidebar from '../components/notes/AISidebar';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import '../styles/Notebook.css';
import { Sparkles, Menu, X } from 'lucide-react';

const NotesLayout = ({ children, sidebar, isAiOpen: externalIsAiOpen, onAiClose: externalOnAiClose, onAiToggle: externalOnAiToggle, aiPrompt, aiContext }) => {
    const [internalIsAiOpen, setInternalIsAiOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const isAiOpen = externalIsAiOpen !== undefined ? externalIsAiOpen : internalIsAiOpen;
    const handleAiToggle = externalOnAiToggle || (() => setInternalIsAiOpen(!internalIsAiOpen));
    const handleAiClose = externalOnAiClose || (() => setInternalIsAiOpen(false));

    return (
        <div>
            {/* Global Sidebar (Desktop) */}
            <Sidebar />

            <div className="notes-layout" style={{ width: 'auto', height: '100vh' }}>
                {/* Mobile Toggle Button for NOTES SIDEBAR */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    style={{ left: '16px', top: '16px' }}
                >
                    {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Notes Sidebar - Pane A */}
                <div className={`notes-sidebar-wrapper ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
                    {sidebar || <NotesSidebar />}
                </div>

                {/* Overlay for mobile sidebar */}
                {isMobileSidebarOpen && (
                    <div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 40 }}
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}

                {/* Main Content - Pane B */}
                <div className="notes-main">
                    {/* Toggle AI Button */}
                    <button
                        onClick={handleAiToggle}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ink-blue)' }}
                    >
                        <Sparkles size={20} fill={isAiOpen ? 'var(--color-electric-lime)' : 'none'} color={isAiOpen ? 'var(--color-ink-blue)' : 'currentColor'} />
                    </button>

                    {children}
                </div>

                {/* AI Sidebar - Pane C */}
                <AISidebar isOpen={isAiOpen} onClose={handleAiClose} initialPrompt={aiPrompt} context={aiContext} />
            </div>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
};

export default NotesLayout;
