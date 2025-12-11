import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Loader2, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/FilePreview.css';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FilePreviewModal = ({ isOpen, onClose, file }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [signedUrl, setSignedUrl] = useState(null);
    const [contentType, setContentType] = useState(null); // 'image', 'pdf', 'text', 'other'

    useEffect(() => {
        if (!isOpen || !file) {
            setContent(null);
            setSignedUrl(null);
            return;
        }

        const loadFile = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Get Signed URL
                // We use the 'url' stored in DB which is the path in storage bucket
                const { data, error: urlError } = await supabase.storage
                    .from('vault_files')
                    .createSignedUrl(file.url, 3600); // 1 hour validity

                if (urlError) throw urlError;
                setSignedUrl(data.signedUrl);

                // 2. Determine Type & Fetch Content if text
                const ext = file.title.split('.').pop().toLowerCase();
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
                const isPdf = ext === 'pdf';
                const isText = ['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py'].includes(ext);

                if (isImage) setContentType('image');
                else if (isPdf) setContentType('pdf');
                else if (isText) {
                    setContentType('text');
                    const response = await fetch(data.signedUrl);
                    const text = await response.text();
                    setContent(text);
                } else {
                    setContentType('other');
                }

            } catch (err) {
                console.error("Preview error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadFile();
    }, [isOpen, file]);

    if (!isOpen || !file) return null;

    const handleDownload = () => {
        if (signedUrl) {
            const a = document.createElement('a');
            a.href = signedUrl;
            a.download = file.title;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="preview-loading">
                    <Loader2 size={48} className="spin" color="#3b82f6" />
                    <p>Loading preview...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="preview-unsupported">
                    <AlertCircle size={48} color="#ef4444" />
                    <p>Failed to load preview</p>
                    <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>{error}</p>
                </div>
            );
        }

        switch (contentType) {
            case 'image':
                return <img src={signedUrl} alt={file.title} className="preview-image" />;

            case 'pdf':
                return <iframe src={signedUrl} title={file.title} className="preview-iframe" />;

            case 'text':
                const ext = file.title.split('.').pop().toLowerCase();
                if (ext === 'md') {
                    return (
                        <div className="preview-code-container markdown-body">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    );
                }
                return (
                    <div className="preview-code-container">
                        <SyntaxHighlighter
                            language={ext === 'js' || ext === 'jsx' ? 'javascript' : ext}
                            style={atomDark}
                            customStyle={{ background: 'transparent', padding: 0 }}
                        >
                            {content}
                        </SyntaxHighlighter>
                    </div>
                );

            default:
                return (
                    <div className="preview-unsupported">
                        <FileText size={64} />
                        <p>No preview available for this file type.</p>
                        <button className="btn-preview-action" onClick={handleDownload} style={{ background: '#3b82f6' }}>
                            <Download size={18} /> Download to View
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="file-preview-overlay" onClick={onClose}>
            <div className="file-preview-header" onClick={e => e.stopPropagation()}>
                <div className="preview-title-group">
                    <span className="preview-title">
                        {file.title}
                    </span>
                    <span className="preview-meta">
                        {file.description || ((file.size || 0) + ' bytes')}
                    </span>
                </div>

                <div className="preview-actions">
                    <button className="btn-preview-action" onClick={handleDownload}>
                        <Download size={18} /> Download
                    </button>
                    {file.type === 'link' && (
                        <button className="btn-preview-action" onClick={() => window.open(file.url, '_blank')}>
                            <ExternalLink size={18} /> Open Link
                        </button>
                    )}
                    <button className="btn-close-preview" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="preview-content" onClick={e => e.stopPropagation()}>
                {renderContent()}
            </div>
        </div>
    );
};

export default FilePreviewModal;
