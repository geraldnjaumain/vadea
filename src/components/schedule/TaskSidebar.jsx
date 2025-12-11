import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from '@fullcalendar/interaction';
import { BookOpen, PenTool, Dumbbell, Plus, Trash2, Sparkles, X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const TaskSidebar = ({ onTaskUpdate, isOpen, onClose, onTaskClick }) => {
    const { user } = useAuth();
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isEstimating, setIsEstimating] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null); // { minutes: 60, title: '...' }

    const fetchTasks = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', user.id)
            .is('start_time', null)
            .neq('status', 'completed') // Only pending
            .order('created_at', { ascending: false });

        if (data) setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, [user, onTaskUpdate]);

    // Initialize Draggable
    useEffect(() => {
        let draggable = null;
        if (containerRef.current) {
            draggable = new Draggable(containerRef.current, {
                itemSelector: '.draggable-source',
                eventData: function (eventEl) {
                    return {
                        id: eventEl.getAttribute('data-id'),
                        title: eventEl.getAttribute('data-title'),
                        duration: { minutes: parseInt(eventEl.getAttribute('data-duration') || '60') },
                        classNames: [eventEl.getAttribute('data-type')],
                        extendedProps: {
                            is_persistent: true,
                            type: 'study_session' // Default to study session on drop
                        }
                    };
                }
            });
        }
        return () => { if (draggable) draggable.destroy(); };
    }, [tasks]);

    // Simplified Task Creation (No blocking AI animation)
    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        // Direct create without AI delay
        await createTask(newTaskTitle, 60);
    };

    const createTask = async (title, minutes) => {
        if (!user) return;

        const { error } = await supabase.from('events').insert({
            user_id: user.id,
            title: title,
            type: 'task',
            start_time: null, // Unscheduled
            status: 'pending'
        });

        if (!error) {
            setNewTaskTitle('');
            fetchTasks();
        }
    };

    const handleDelete = async (id) => {
        await supabase.from('events').delete().eq('id', id);
        fetchTasks();
    };

    return (
        <div className={`schedule-sidebar ${isOpen ? 'open' : ''}`} ref={containerRef}>
            {/* Mobile Header */}
            <div className="md:hidden" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-ink-blue)' }}>Tasks</h3>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    style={{ background: 'none', border: 'none', padding: '12px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, minWidth: '44px', minHeight: '44px' }}
                >
                    <X size={24} />
                </button>
            </div>

            <h3 className="hidden md:block" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-ink-blue)', marginBottom: '16px' }}>Backlog</h3>

            {/* Simple Input Form */}
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="Add a task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
                <button
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    style={{ background: 'var(--color-ink-blue)', color: 'white', border: 'none', borderRadius: '8px', width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                    <Plus size={20} />
                </button>
            </form>

            {/* Task List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {tasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                        <div style={{ marginBottom: '12px' }}><Check size={24} /></div>
                        <p>No pending tasks.<br />Great job!</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="draggable-source"
                            data-id={task.id}
                            data-title={task.title}
                            data-type="study" // Maps to .event-study css
                            data-duration="60" // Default 60 for now, could save estimate to DB later
                            onClick={() => {
                                if (isMobile && onTaskClick) {
                                    onTaskClick(task);
                                }
                            }}
                        >
                            <div style={{ color: '#94a3b8' }}><PenTool size={16} /></div>
                            <div style={{ flex: 1 }}>{task.title}</div>
                            <button
                                onClick={() => handleDelete(task.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '4px' }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: 'auto', padding: '16px', background: '#e0f2fe', borderRadius: '12px', color: '#0369a1', fontSize: '0.875rem', display: 'flex', gap: '12px' }}>
                <Dumbbell size={20} />
                <p><strong>Tip:</strong> Drag valid tasks onto the calendar to block time.</p>
            </div>
        </div>
    );
};

export default TaskSidebar;
