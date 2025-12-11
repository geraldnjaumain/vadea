import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud, FileText, Image, File, Loader2, Plus } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUpload, buckets }) => {
    const [mode, setMode] = useState('select'); // 'select' or 'create'
    const [selectedBucket, setSelectedBucket] = useState(buckets[0] || 'General');
    const [newBucketName, setNewBucketName] = useState('');
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Update selected bucket if buckets list changes
    useEffect(() => {
        if (buckets.length > 0 && !buckets.includes(selectedBucket)) {
            setSelectedBucket(buckets[0]);
        }
    }, [buckets]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        const targetBucket = mode === 'create' ? newBucketName.trim() : selectedBucket;
        if (!targetBucket) return;

        setUploading(true);
        try {
            await onUpload(files, targetBucket);
            setFiles([]);
            setNewBucketName('');
            setMode('select');
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return <Image size={20} />;
        if (file.type === 'application/pdf') return <FileText size={20} />;
        return <File size={20} />;
    };

    if (!isOpen) return null;

    return (
        <div className="upload-modal-overlay" onClick={onClose}>
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="upload-modal-header">
                    <h3>Upload Files</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="upload-modal-body">
                    {/* Bucket Selector */}
                    <div className="bucket-selector">
                        <label>Save to:</label>
                        {mode === 'select' ? (
                            <div className="bucket-select-wrapper" style={{ flex: 1, display: 'flex', gap: '8px' }}>
                                <select
                                    value={selectedBucket}
                                    onChange={(e) => setSelectedBucket(e.target.value)}
                                >
                                    {buckets.map(bucket => (
                                        <option key={bucket} value={bucket}>{bucket}</option>
                                    ))}
                                </select>
                                <button
                                    className="btn-icon-secondary"
                                    onClick={() => setMode('create')}
                                    title="Create new folder"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="bucket-create-wrapper" style={{ flex: 1, display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter folder name..."
                                    value={newBucketName}
                                    onChange={(e) => setNewBucketName(e.target.value)}
                                    autoFocus
                                    className="bucket-input"
                                />
                                <button
                                    className="btn-icon-secondary"
                                    onClick={() => setMode('select')}
                                    title="Cancel"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`upload-dropzone ${isDragActive ? 'active' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <UploadCloud size={48} strokeWidth={1.5} />
                        <p className="dropzone-text">
                            {isDragActive
                                ? "Drop files here..."
                                : "Drag & drop files here, or click to browse"
                            }
                        </p>
                        <span className="dropzone-hint">All file types supported</span>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="upload-file-list">
                            {files.map((file, index) => (
                                <div key={index} className="upload-file-item">
                                    <div className="file-icon">{getFileIcon(file)}</div>
                                    <div className="file-info">
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                    <button
                                        className="file-remove-btn"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="upload-modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-upload"
                        onClick={handleUpload}
                        disabled={files.length === 0 || uploading || (mode === 'create' && !newBucketName.trim())}
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={18} className="spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud size={18} />
                                Upload {files.length > 0 ? `(${files.length})` : ''}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
