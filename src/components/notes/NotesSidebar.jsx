import React, { useEffect, useState } from 'react';
import { Search, Plus, FileText, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../ConfirmationModal'; // Import custom modal

const NotesSidebar = ({ activeNoteId, onSelectNote, onCreateNote }) => {
    const { user } = useAuth();
    const toast = useToast();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Deletion State
    const [noteToDelete, setNoteToDelete] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchNotes = async () => {
            const { data } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (data) setNotes(data);
            setLoading(false);
        };
        fetchNotes();

        const subscription = supabase
            .channel('notes_list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, fetchNotes)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };

    }, [user]);

    // Step 1: Request Deletion (Open Modal)
    const requestDelete = (e, noteId) => {
        e.stopPropagation();
        setNoteToDelete(noteId);
    };

    // Step 2: Confirm Deletion (Execute Logic)
    const confirmDelete = async () => {
        if (!noteToDelete) return;

        const noteId = noteToDelete;
        setNoteToDelete(null); // Close modal logic

        const toastId = toast.loading('Deleting note...');
        try {
            await supabase.from('notes').delete().eq('id', noteId);

            setNotes(prev => prev.filter(n => n.id !== noteId));

            if (activeNoteId === noteId) {
                onSelectNote(null);
            }
            toast.success('Note deleted', undefined, { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Delete failed', error.message, { id: toastId });
        }
    };

    const filteredNotes = notes.filter(note =>
        (note.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="notes-sidebar">
            <div style={{ padding: '0 16px 16px 16px' }}>
                <div className="search-box">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="notes-search-input"
                    />
                </div>
            </div>

            <button className="new-note-btn" onClick={onCreateNote}>
                <Plus size={16} />
                <span>New Note</span>
            </button>

            <div className="notes-list-container">
                <div className="nav-group-title">All Notes</div>
                {loading ? (
                    <div className="loading-state"><Loader2 className="spin" size={20} /></div>
                ) : filteredNotes.length === 0 ? (
                    <div className="empty-state-text">
                        {searchQuery ? 'No matching notes' : 'No notes yet'}
                    </div>
                ) : (
                    filteredNotes.map(note => (
                        <div
                            key={note.id}
                            className={`note-item ${activeNoteId === note.id ? 'active' : ''}`}
                            onClick={() => onSelectNote(note.id)}
                        >
                            <div className="note-item-icon">
                                <FileText size={16} />
                            </div>
                            <span className="note-item-title">{note.title || 'Untitled'}</span>

                            <button
                                className="note-delete-action"
                                onClick={(e) => requestDelete(e, note.id)}
                                title="Delete note"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="sidebar-footer">
                {notes.length} notes
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!noteToDelete}
                onClose={() => setNoteToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default NotesSidebar;
