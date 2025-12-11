import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import VaultTopBar from '../components/vault/VaultTopBar';
import ResourceCard from '../components/vault/ResourceCard';
import PasteModal from '../components/vault/PasteModal';
import UploadModal from '../components/vault/UploadModal';
import FilePreviewModal from '../components/vault/FilePreviewModal';
import { UploadCloud, FolderOpen } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ingestFile } from '../lib/rag';
import '../styles/Vault.css';

// Generate a color based on string (for dynamic bucket colors)
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Pastel colors for buckets
const BUCKET_COLORS = ['#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];
const getBucketColor = (index) => BUCKET_COLORS[index % BUCKET_COLORS.length];

const CourseBucket = ({ title, color, resources, onUpload, onDelete, onView, viewMode }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: acceptedFiles => onUpload(acceptedFiles, title)
    });

    return (
        <div className="course-bucket">
            <div className="bucket-header">
                <div style={{ width: '4px', height: '24px', backgroundColor: color, borderRadius: '2px' }}></div>
                <h2 className="bucket-title">{title}</h2>
                <span className="bucket-count">{resources.length} items</span>
            </div>
            <div className={`bucket-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {resources.map((res) => (
                    <ResourceCard
                        key={res.id}
                        {...res}
                        onDelete={() => onDelete(res.id, res.url, res.type)}
                        onView={() => onView(res)}
                        viewMode={viewMode}
                        accentColor={color}
                    />
                ))}
                <div {...getRootProps()} className="empty-bucket-dropzone" style={{ minHeight: resources.length === 0 ? '120px' : '60px', border: isDragActive ? '2px dashed #3b82f6' : '2px dashed #cbd5e1' }}>
                    <input {...getInputProps()} />
                    <UploadCloud size={32} style={{ opacity: 0.5 }} />
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                        {isDragActive ? "Drop here..." : "Upload to " + title}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Vault = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [pasteModalOpen, setPasteModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null); // For File Canvas/Preview
    const [pastedUrl, setPastedUrl] = useState('');
    const [resources, setResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setResources(data);
        } catch (error) {
            console.error('Error fetching resources:', error);
            toast.error('Failed to load vault', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchResources(); }, [user]);

    useEffect(() => {
        const handlePaste = (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                const text = e.clipboardData.getData('text');
                if (text.startsWith('http')) {
                    setPastedUrl(text);
                    setPasteModalOpen(true);
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const handleFileUpload = async (files, bucketName) => {
        if (!user) return;

        let successCount = 0;
        const toastId = toast.loading('Uploading...', `Processing ${files.length} file(s)`);

        for (const file of files) {
            try {
                // Size check (limit 50MB) - Restriction is only on size, not type
                if (file.size > 50 * 1024 * 1024) {
                    toast.error('File too large', `${file.name} exceeds 50MB limit.`);
                    continue;
                }

                const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`; // Sanitize filename

                // 1. Upload to Storage
                const { data, error: uploadError } = await supabase.storage
                    .from('vault_files')
                    .upload(`${user.id}/${fileName}`, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Storage Upload Error:', uploadError);
                    toast.error(`Upload failed: ${file.name}`, uploadError.message);
                    continue;
                }

                const filePath = data.path;

                // 2. Create DB Record
                const { data: resource, error: dbError } = await supabase
                    .from('resources')
                    .insert({
                        user_id: user.id,
                        title: file.name,
                        type: 'file',
                        url: filePath,
                        tags: [bucketName], // Uses the selected/created bucket name
                        description: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                        embedding_status: 'pending'
                    })
                    .select()
                    .single();

                if (dbError) {
                    console.error('Database Insert Error:', dbError);
                    toast.error(`Save failed: ${file.name}`, 'Database record could not be created');
                    // Clean up orphaned file
                    await supabase.storage.from('vault_files').remove([filePath]);
                    continue;
                }

                successCount++;

                // 3. Process PDF for AI (Optional)
                if (resource && file.type === 'application/pdf') {
                    processPdfEmbedding(file, resource.id);
                }

            } catch (err) {
                console.error('Unexpected upload error:', err);
                toast.error('Unexpected error', `Failed to upload ${file.name}`);
            }
        }

        toast.dismiss(toastId);
        if (successCount > 0) {
            toast.success('Upload complete', `Successfully uploaded ${successCount} file(s) to "${bucketName}"`);
            fetchResources();
        }
    };

    const processPdfEmbedding = async (file, resourceId) => {
        try {
            await supabase
                .from('resources')
                .update({ embedding_status: 'processing' })
                .eq('id', resourceId);

            await ingestFile(file, resourceId);

            await supabase
                .from('resources')
                .update({ embedding_status: 'completed' })
                .eq('id', resourceId);

            toast.success('AI Ready', 'File processed for Study Buddy');
        } catch (e) {
            console.error('Embedding failed', e);
            await supabase
                .from('resources')
                .update({ embedding_status: 'failed' })
                .eq('id', resourceId);
            toast.error('AI Processing Failed', 'Could not read file context');
        }
    };

    const handleDeleteResource = async (resourceId, url, type) => {
        const toastId = toast.loading('Deleting...', 'Removing resource');

        try {
            // Delete from storage if it's a file
            if (type === 'file' && url) {
                const { error: storageError } = await supabase.storage
                    .from('vault_files')
                    .remove([url]);

                if (storageError) console.error('Storage delete error:', storageError);
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from('resources')
                .delete()
                .eq('id', resourceId);

            if (dbError) throw dbError;

            toast.dismiss(toastId);
            toast.success('Deleted', 'Resource moved to trash');
            setResources(prev => prev.filter(r => r.id !== resourceId));
        } catch (error) {
            toast.dismiss(toastId);
            console.error('Delete error:', error);
            toast.error('Delete failed', error.message);
        }
    };

    const handleSaveLink = async (targetBucket, title) => {
        if (!user || !pastedUrl) return;
        const toastId = toast.loading('Saving...', 'Saving link to vault');

        try {
            await supabase.from('resources').insert({
                user_id: user.id,
                title: title || pastedUrl,
                type: 'link',
                url: pastedUrl,
                tags: [targetBucket || 'General'],
                description: 'Saved link'
            });
            toast.dismiss(toastId);
            toast.success('Link saved', `Saved to ${targetBucket}`);
            setPasteModalOpen(false);
            setPastedUrl('');
            fetchResources();
        } catch (error) {
            toast.dismiss(toastId);
            console.error('Error saving link:', error);
            toast.error('Save failed', 'Could not save link');
        }
    };

    // Calculate dynamic buckets from resources
    const groupedResources = useMemo(() => {
        const groups = {};

        if (resources.length === 0) return {};

        resources.forEach(res => {
            const bucket = res.tags?.[0] || 'Uncategorized';
            if (!groups[bucket]) groups[bucket] = [];
            groups[bucket].push(res);
        });

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            Object.keys(groups).forEach(bucket => {
                groups[bucket] = groups[bucket].filter(r =>
                    r.title?.toLowerCase().includes(query) ||
                    r.description?.toLowerCase().includes(query) ||
                    r.url?.toLowerCase().includes(query)
                );
                // Remove empty buckets after filtering
                if (groups[bucket].length === 0) delete groups[bucket];
            });
        }

        return groups;
    }, [resources, searchQuery]);

    const availableBuckets = useMemo(() => {
        const buckets = Object.keys(groupedResources);
        return buckets.length > 0 ? buckets : ['General'];
    }, [groupedResources]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <BottomNav />
            <main className="main-content" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                <VaultTopBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onAddNew={() => setUploadModalOpen(true)}
                />

                <div className="vault-content">
                    {loading ? (
                        <div className="vault-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading your vault...</p>
                        </div>
                    ) : Object.keys(groupedResources).length === 0 ? (
                        <div className="vault-empty-state">
                            <div className="empty-icon-bg">
                                <FolderOpen size={48} color="#94a3b8" />
                            </div>
                            <h3>Your vault is empty</h3>
                            <p>Upload files or paste links to start building your library.</p>
                            <button className="btn-primary-large" onClick={() => setUploadModalOpen(true)}>
                                Upload Files
                            </button>
                        </div>
                    ) : (
                        Object.entries(groupedResources).sort().map(([bucket, items], index) => (
                            <CourseBucket
                                key={bucket}
                                title={bucket}
                                color={getBucketColor(index)}
                                resources={items}
                                onUpload={handleFileUpload}
                                onDelete={handleDeleteResource}
                                onView={(file) => setPreviewFile(file)}
                                viewMode={viewMode}
                            />
                        ))
                    )}
                </div>
            </main>

            <PasteModal
                isOpen={pasteModalOpen}
                url={pastedUrl}
                buckets={availableBuckets}
                onClose={() => { setPasteModalOpen(false); setPastedUrl(''); }}
                onSave={handleSaveLink}
            />

            <UploadModal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onUpload={handleFileUpload}
                buckets={availableBuckets}
            />

            <FilePreviewModal
                isOpen={!!previewFile}
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </div>
    );
};

// ... extractTextFromPDF helper (same as before or imported)


export default Vault;
