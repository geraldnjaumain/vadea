import React, { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

const PasteModal = ({ isOpen, url, buckets = ['General'], onClose, onSave }) => {
    const [selectedBucket, setSelectedBucket] = useState(buckets[0] || 'General');
    const [title, setTitle] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(selectedBucket, title || url);
    };

    // Extract domain for display
    const getDomain = (urlString) => {
        try {
            return new URL(urlString).hostname;
        } catch {
            return urlString;
        }
    };

    return (
        <div className="paste-modal-overlay" onClick={onClose}>
            <div className="paste-modal" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '16px', color: 'var(--color-ink-blue)' }}>
                    Smart Paste Detected
                </h3>

                <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '6px', height: 'fit-content' }}>
                        <LinkIcon size={20} color="#0369a1" />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>Incoming Link</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {getDomain(url)}
                        </div>
                    </div>
                </div>

                {/* Title Input */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
                        Title (optional)
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={url}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Bucket Selector */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
                        Save to
                    </label>
                    <select
                        value={selectedBucket}
                        onChange={(e) => setSelectedBucket(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            background: 'white',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        {buckets.map(bucket => (
                            <option key={bucket} value={bucket}>{bucket}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.875rem', marginBottom: '24px' }}>
                    <SparklesIcon />
                    <span>AI Suggestion: Save to <strong>{selectedBucket}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--color-ink-blue)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Save to Vault
                    </button>
                </div>
            </div>
        </div>
    );
};

const SparklesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#10B981" />
    </svg>
);

export default PasteModal;
