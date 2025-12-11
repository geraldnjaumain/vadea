import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Moon, Sun, Download, Trash2, Edit2, Check, X, Key } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/Settings.css';

const Settings = () => {
    const { user, logout } = useAuth();
    const toast = useToast();

    const [profile, setProfile] = useState(null);
    const [theme, setTheme] = useState('light');
    const [uploading, setUploading] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Edit states
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [savingName, setSavingName] = useState(false);

    // Password change states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    // Delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchProfile();
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setProfile(data);
                setEditedName(data.full_name || '');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            fetchProfile();
            toast.success('Avatar updated', 'Your profile picture has been changed');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Upload failed', error.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveName = async () => {
        if (!editedName.trim()) {
            toast.error('Invalid name', 'Please enter a valid name');
            return;
        }

        setSavingName(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editedName.trim(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            fetchProfile();
            setIsEditingName(false);
            toast.success('Name updated', 'Your display name has been changed');
        } catch (error) {
            console.error('Error updating name:', error);
            toast.error('Update failed', error.message || 'Failed to update name');
        } finally {
            setSavingName(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        toast.success('Theme changed', `Switched to ${newTheme} mode`);
    };

    const handleExportData = async () => {
        if (!user) return;

        setExporting(true);
        try {
            const { data: notes } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id);

            const { data: events } = await supabase
                .from('events')
                .select('*')
                .eq('user_id', user.id);

            const { data: resources } = await supabase
                .from('vault_resources')
                .select('*')
                .eq('user_id', user.id);

            const exportData = {
                profile: profile,
                notes: notes || [],
                events: events || [],
                resources: resources || [],
                exportedAt: new Date().toISOString(),
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vadea-export-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success('Export complete', 'Your data has been downloaded');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Export failed', error.message || 'Failed to export data');
        } finally {
            setExporting(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            toast.error('Password too short', 'Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords don\'t match', 'Please ensure both passwords are identical');
            return;
        }

        setChangingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setShowPasswordModal(false);
            setNewPassword('');
            setConfirmPassword('');
            toast.success('Password changed', 'Your password has been updated successfully');
        } catch (error) {
            console.error('Password change error:', error);
            toast.error('Password change failed', error.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            // Delete user data from tables
            await supabase.from('notes').delete().eq('user_id', user.id);
            await supabase.from('events').delete().eq('user_id', user.id);
            await supabase.from('vault_resources').delete().eq('user_id', user.id);
            await supabase.from('profiles').delete().eq('id', user.id);

            // Sign out the user
            await logout();

            toast.success('Account deleted', 'Your account and all data have been removed');
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error('Delete failed', error.message || 'Failed to delete account');
            setDeleting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="settings-container">
                <h1 className="settings-title">Settings</h1>

                {/* Profile Section */}
                <div className="settings-section">
                    <h2>Profile</h2>
                    <div className="profile-settings">
                        <div className="avatar-upload">
                            <div className="avatar-preview">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" />
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            <label className="upload-button">
                                {uploading ? 'Uploading...' : 'Change Avatar'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                        <div className="profile-info">
                            <div className="info-row">
                                <label>Name</label>
                                {isEditingName ? (
                                    <div className="edit-name-row">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="edit-name-input"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSaveName}
                                            className="icon-btn success"
                                            disabled={savingName}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingName(false);
                                                setEditedName(profile?.full_name || '');
                                            }}
                                            className="icon-btn cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="name-display">
                                        <span>{profile?.full_name || 'Not set'}</span>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            className="icon-btn edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="info-row">
                                <label>Email</label>
                                <span>{user?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="settings-section">
                    <h2>Security</h2>
                    <div className="data-actions">
                        <button onClick={() => setShowPasswordModal(true)} className="action-button">
                            <Key size={18} />
                            <span>Change Password</span>
                        </button>
                        <p className="action-description">
                            Update your account password
                        </p>
                    </div>
                </div>

                {/* Theme Section */}
                <div className="settings-section">
                    <h2>Appearance</h2>
                    <div className="theme-toggle">
                        <div>
                            <strong>Theme</strong>
                            <p>Choose your preferred color scheme</p>
                        </div>
                        <button onClick={toggleTheme} className="toggle-button">
                            {theme === 'light' ? (
                                <>
                                    <Sun size={18} />
                                    <span>Light</span>
                                </>
                            ) : (
                                <>
                                    <Moon size={18} />
                                    <span>Dark</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Data Section */}
                <div className="settings-section">
                    <h2>Data Management</h2>
                    <div className="data-actions">
                        <button
                            onClick={handleExportData}
                            className="action-button"
                            disabled={exporting}
                        >
                            <Download size={18} />
                            <span>{exporting ? 'Exporting...' : 'Export All Data'}</span>
                        </button>
                        <p className="action-description">
                            Download all your notes, events, and vault resources as JSON
                        </p>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-section danger-zone">
                    <h2>Danger Zone</h2>
                    <button
                        className="delete-button"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={deleting}
                    >
                        <Trash2 size={18} />
                        <span>{deleting ? 'Deleting...' : 'Delete Account'}</span>
                    </button>
                    <p className="danger-warning">
                        This action is permanent and cannot be undone
                    </p>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Change Password</h3>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleChangePassword}
                                disabled={changingPassword}
                            >
                                {changingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                message="This will permanently delete your account and all associated data including notes, events, and vault resources. This action cannot be undone."
                confirmText="Delete My Account"
                cancelText="Keep Account"
                isDanger={true}
            />
        </DashboardLayout>
    );
};

export default Settings;
