import React from 'react';
import { Plus, FileText, X, MessageSquare } from 'lucide-react';

const AISidebar = ({ activeFile, onClose }) => {
    return (
        <div className="ai-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-ink-blue)' }}>Lab Partner</h2>
                {/* Mobile Close Button */}
                <button className="md-hidden" onClick={onClose} style={{ background: 'none', border: 'none' }}>
                    <X size={20} color="#94a3b8" />
                </button>
            </div>

            <button style={{ width: '100%', padding: '8px', border: '1px solid #0B1120', borderRadius: '8px', background: 'transparent', color: '#0B1120', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                <Plus size={16} /> New Chat
            </button>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Active Context</div>

            {activeFile ? (
                <div className="context-chip">
                    <FileText size={16} color="#ef4444" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeFile}</span>
                    <button style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <X size={14} color="#94a3b8" />
                    </button>
                </div>
            ) : (
                <div className="context-chip" style={{ borderStyle: 'dashed', color: '#94a3b8', justifyContent: 'center', cursor: 'pointer' }}>
                    <Plus size={16} /> Add Context
                </div>
            )}

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', marginTop: 'auto' }}>History</div>
            <div className="history-item active"><MessageSquare size={14} style={{ display: 'inline', marginRight: '8px' }} /> Calculus Limits Quiz</div>
            <div className="history-item"><MessageSquare size={14} style={{ display: 'inline', marginRight: '8px' }} /> History Essay Outline</div>
            <div className="history-item"><MessageSquare size={14} style={{ display: 'inline', marginRight: '8px' }} /> Physics Problem 4</div>
        </div>
    );
};

export default AISidebar;
