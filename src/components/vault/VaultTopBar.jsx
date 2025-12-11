import React from 'react';
import { Search, Plus, List, Grid } from 'lucide-react';

const VaultTopBar = ({
    searchQuery = '',
    onSearchChange,
    viewMode = 'grid',
    onViewModeChange,
    onAddNew
}) => {
    return (
        <div className="vault-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.875rem' }}>
                <span>Vault</span>
                <span>/</span>
                <span style={{ fontWeight: 600, color: 'var(--color-ink-blue)' }}>Library</span>
            </div>

            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                    type="text"
                    className="vault-search"
                    placeholder="Search resources..."
                    style={{ paddingLeft: '36px' }}
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                    <button
                        onClick={() => onViewModeChange?.('grid')}
                        style={{
                            border: 'none',
                            background: viewMode === 'grid' ? 'white' : 'transparent',
                            padding: '6px',
                            borderRadius: '6px',
                            boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <Grid size={16} color={viewMode === 'grid' ? '#0f172a' : '#64748B'} />
                    </button>
                    <button
                        onClick={() => onViewModeChange?.('list')}
                        style={{
                            border: 'none',
                            background: viewMode === 'list' ? 'white' : 'transparent',
                            padding: '6px',
                            borderRadius: '6px',
                            boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            cursor: 'pointer',
                            color: viewMode === 'list' ? '#0f172a' : '#64748B'
                        }}
                    >
                        <List size={16} />
                    </button>
                </div>

                <button className="btn-add-new" onClick={onAddNew}>
                    <Plus size={18} />
                    <span>Add New</span>
                </button>
            </div>
        </div>
    );
};

export default VaultTopBar;
