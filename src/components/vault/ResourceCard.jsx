import React, { useState } from 'react';
import { ExternalLink, FileText, Link as LinkIcon, Download, Trash2, Image, File } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

const ResourceCard = ({ id, type, title, url, description, tags, onDelete, viewMode, onView, accentColor = '#64748b' }) => {
    const toast = useToast();
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isLink = type === 'link';

    // Helper for tag background (hex + opacity)
    const tagBgColor = accentColor.length === 7 ? `${accentColor}33` : '#f1f5f9';
    const tagTextColor = accentColor.length === 7 ? accentColor : '#0f172a';

    // Determine file type icon
    const getFileIcon = () => {
        if (isLink) return <LinkIcon size={48} strokeWidth={1} />;

        const extension = title?.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return <Image size={48} strokeWidth={1} />;
        }
        if (extension === 'pdf') {
            return <FileText size={48} strokeWidth={1} color="#ef4444" />;
        }
        return <File size={48} strokeWidth={1} />;
    };

    const handleClick = async (e) => {
        // Prevent click when clicking delete button
        if (e.target.closest('.delete-btn')) return;

        if (isLink) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            // Priority: View if handler exists, otherwise download
            if (onView) {
                onView();
            } else {
                handleDownload();
            }
        }
    };

    const handleDownload = async () => {
        try {
            const { data, error } = await supabase.storage.from('vault_files').download(url);
            if (error) throw error;
            const blobUrl = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = title;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            toast.success('Download started', title);
        } catch (err) {
            console.error('Download failed:', err);
            toast.error('Download failed', err.message);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await onDelete?.();
        } catch {
            setIsDeleting(false);
        }
    };

    if (viewMode === 'list') {
        return (
            <div
                className="resource-card list-item"
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="list-item-icon">
                    {isLink ? <LinkIcon size={20} /> : <FileText size={20} />}
                </div>
                <div className="list-item-content">
                    <span className="list-item-title">{title}</span>
                    <span className="list-item-meta">{description}</span>
                </div>
                {tags?.[0] && (
                    <span className="card-tag" style={{ backgroundColor: tagBgColor, color: tagTextColor }}>
                        {tags[0]}
                    </span>
                )}
                <div className="list-item-actions">
                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="resource-card"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-image">
                {getFileIcon()}

                {/* Type Overlay Icon - Only for links */}
                {isLink && (
                    <div className="card-type-badge">
                        <ExternalLink size={14} />
                    </div>
                )}

                {/* Hover Actions */}
                <div className={`card-hover-actions ${isHovered ? 'visible' : ''}`}>
                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="card-footer">
                {tags?.[0] && (
                    <span className="card-tag" style={{ backgroundColor: tagBgColor, color: tagTextColor }}>
                        {tags[0]}
                    </span>
                )}
                <div className="card-title">{title}</div>
                <div className="card-meta">{description}</div>
            </div>
        </div>
    );
};

export default ResourceCard;
