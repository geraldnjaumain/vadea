import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, FileText, Link as LinkIcon, FolderOpen, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/Vault.css'; // Reuse Vault styles

const VaultPickerModal = ({ isOpen, onClose, onAttach, activeContextIds = [] }) => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch resources when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setLoading(true);
            const fetchResources = async () => {
                const { data, error } = await supabase
                    .from('resources')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (data) setResources(data);
                setLoading(false);
            };
            fetchResources();
            setSelectedIds([]); // Reset selection on open
        }
    }, [isOpen, user]);

    // Filter resources
    const filteredResources = useMemo(() => {
        if (!searchQuery) return resources;
        const query = searchQuery.toLowerCase();
        return resources.filter(r =>
            r.title.toLowerCase().includes(query) ||
            r.tags?.some(t => t.toLowerCase().includes(query))
        );
    }, [resources, searchQuery]);

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAttach = () => {
        const selectedFiles = resources.filter(r => selectedIds.includes(r.id));
        onAttach(selectedFiles);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="modal-header">
                    <h2>Attach from Vault</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div style={{ padding: '0 24px 16px' }}>
                    <div className="vault-search-bar">
                        <Search size={20} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search your files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* List */}
                <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
                    {loading ? (
                        <div className="loading-spinner" style={{ margin: '40px auto' }}></div>
                    ) : filteredResources.length === 0 ? (
                        <div className="vault-empty-state" style={{ minHeight: '200px' }}>
                            <FolderOpen size={48} color="#cbd5e1" />
                            <p>No matching files found.</p>
                        </div>
                    ) : (
                        <div className="request-list">
                            {filteredResources.map(res => {
                                const isSelected = selectedIds.includes(res.id);
                                const isAlreadyAttached = activeContextIds.includes(res.id);

                                return (
                                    <div
                                        key={res.id}
                                        className={`resource-card list-view ${isSelected ? 'selected' : ''} ${isAlreadyAttached ? 'disabled' : ''}`}
                                        style={{
                                            cursor: isAlreadyAttached ? 'default' : 'pointer',
                                            opacity: isAlreadyAttached ? 0.6 : 1,
                                            border: isSelected ? '2px solid var(--color-electric-lime)' : '1px solid var(--color-surface-border)',
                                            background: isSelected ? 'rgba(212, 255, 0, 0.05)' : 'var(--color-surface)'
                                        }}
                                        onClick={() => !isAlreadyAttached && toggleSelection(res.id)}
                                    >
                                        <div className="resource-icon">
                                            {res.type === 'link' ? <LinkIcon size={20} /> : <FileText size={20} />}
                                        </div>
                                        <div className="resource-info">
                                            <h4 className="resource-title">{res.title}</h4>
                                            <div className="resource-meta">
                                                {res.tags?.[0] && <span className="resource-tag">{res.tags[0]}</span>}
                                                <span>•</span>
                                                <span>{new Date(res.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {isAlreadyAttached && <span style={{ fontSize: '0.75rem', color: 'var(--color-electric-lime)' }}>Attached</span>}
                                        {isSelected && !isAlreadyAttached && <CheckCircle size={20} color="var(--color-electric-lime)" fill="var(--color-ink-blue)" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                        {selectedIds.length} selected
                    </span>
                    <button
                        className="btn-primary"
                        disabled={selectedIds.length === 0}
                        onClick={handleAttach}
                    >
                        Attach Selected
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VaultPickerModal;
