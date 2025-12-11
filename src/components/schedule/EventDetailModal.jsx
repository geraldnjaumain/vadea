import React, { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../ConfirmationModal';
import '../../styles/EventModal.css';

const EventDetailModal = ({ event, onClose, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const toast = useToast();
    const [title, setTitle] = useState(event.title || '');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [type, setType] = useState(event.extendedProps?.type || 'task');
    const [course, setCourse] = useState(event.extendedProps?.course || '');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (event.start) {
            const start = new Date(event.start);
            setStartTime(start.toISOString().slice(0, 16));
        }
        if (event.end) {
            const end = new Date(event.end);
            setEndTime(end.toISOString().slice(0, 16));
        }
    }, [event]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (!user) throw new Error("You must be logged in to save events.");

            if (event.id && !event.id.toString().startsWith('new')) {
                // Update Existing
                const { error } = await supabase
                    .from('events')
                    .update({
                        title,
                        start_time: startTime,
                        end_time: endTime || null,
                        type,
                        course
                    })
                    .eq('id', event.id);
                if (error) throw error;
            } else {
                // Create New
                const { data, error } = await supabase
                    .from('events')
                    .insert({
                        user_id: user.id,
                        title,
                        start_time: startTime,
                        end_time: endTime || null,
                        type,
                        course,
                        status: 'pending'
                    })
                    .select();

                if (error) throw error;
                event.id = data[0].id;
            }

            onUpdate({
                ...event,
                title,
                start: startTime,
                end: endTime,
                extendedProps: { type, course }
            });
            toast.success("Event Saved", "Your schedule has been updated.");
            onClose();
        } catch (error) {
            console.error('Error saving event:', error);
            toast.error("Save Failed", error.message || "Could not save event.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', event.id);

            if (error) throw error;

            toast.success("Event Deleted", "The event has been removed.");
            onDelete(event.id);
            onClose();
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error("Delete Failed", "Could not delete event.");
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Edit Event</h2>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            style={{ zIndex: 10, padding: '12px', margin: '-12px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Event title"
                            />
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="class">Class</option>
                                <option value="task">Task</option>
                                <option value="exam">Exam</option>
                                <option value="deadline">Deadline</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Course (optional)</label>
                            <input
                                type="text"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                placeholder="e.g., CS 101"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn-danger"
                            onClick={handleDeleteClick}
                            disabled={isLoading}
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                        <button
                            className="btn-primary"
                            onClick={handleSave}
                            disabled={isLoading || !title.trim()}
                        >
                            <Save size={16} />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Event?"
                message={`Are you sure you want to delete "${title || 'this event'}"? This action cannot be undone.`}
                confirmText="Delete"
                isDanger={true}
            />
        </>
    );
};

export default EventDetailModal;
