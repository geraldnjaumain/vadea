import React, { useState, useEffect } from 'react';
import ScheduleLayout from '../layouts/ScheduleLayout';
import Calendar from '../components/schedule/Calendar';
import TaskSidebar from '../components/schedule/TaskSidebar';
import EventDetailModal from '../components/schedule/EventDetailModal';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Menu, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

const Schedule = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Refresh trigger
    const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);

    // Responsive Check
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchEvents = async () => {
        if (!user) return;
        const { data } = await supabase.from('events').select('*').eq('user_id', user.id).not('start_time', 'is', null);
        if (data) {
            const formatted = data.map(e => ({
                id: e.id,
                title: e.title,
                start: e.start_time,
                end: e.end_time,
                allDay: e.is_all_day,
                extendedProps: { type: e.type, course: e.course },
                className: `event-${e.type}`
            }));
            setEvents(formatted);
        }
    };

    useEffect(() => { fetchEvents(); }, [user]);

    const handleEventChange = async (changeInfo) => {
        const { event } = changeInfo;
        await supabase.from('events').update({
            start_time: event.start.toISOString(),
            end_time: event.end ? event.end.toISOString() : null,
            is_all_day: event.allDay
        }).eq('id', event.id);
    };

    const handleEventReceive = async (info) => {
        const { event } = info;
        try {
            const isPersistent = event.extendedProps.is_persistent;

            // When dragging from Sidebar, we want to convert "Task" -> "Study Session" (Time Block)

            if (isPersistent) {
                const { error } = await supabase.from('events').update({
                    start_time: event.start.toISOString(),
                    end_time: event.end ? event.end.toISOString() : new Date(event.start.getTime() + 60 * 60 * 1000).toISOString(),
                    is_all_day: event.allDay,
                    type: 'study_session' // Force type change to Study Session on schedule
                }).eq('id', event.id);

                if (error) throw error;

                // Success
                event.remove(); // Remove optimistic one added by FullCalendar
                await fetchEvents(); // Re-fetch to get cleaner state from DB
                setSidebarRefreshTrigger(p => p + 1); // Refresh sidebar
            }
        } catch (error) {
            console.error("Error receiving event:", error);
            event.remove(); // Remove optimistic on error to avoid ghost events
            toast.error("Schedule Failed", error.message || "Could not schedule task.");
        }
    };

    return (
        <ScheduleLayout>
            <div className="schedule-container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>

                {/* Mobile Tasks Toggle */}
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 90, background: 'var(--color-ink-blue)', color: 'white', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                    >
                        <Plus size={24} />
                    </button>
                )}

                {/* Main Calendar */}
                <div className="schedule-main">
                    <Calendar
                        events={events}
                        onEventChange={handleEventChange}
                        onEventReceive={handleEventReceive}
                        onEventClick={async (event, isToggleComplete) => {
                            if (isToggleComplete) {
                                // Toggle Completion status
                                const currentStatus = event.extendedProps.status;
                                const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

                                // Optimistic update
                                event.setExtendedProp('status', newStatus);

                                // Delight: Confetti on completion
                                if (newStatus === 'completed') {
                                    confetti({
                                        particleCount: 100,
                                        spread: 70,
                                        origin: { y: 0.6 },
                                        colors: ['#0B1120', '#3B82F6', '#BE123C', '#84cc16'] // App Colors
                                    });
                                }

                                const { error } = await supabase
                                    .from('events')
                                    .update({ status: newStatus })
                                    .eq('id', event.id);

                                if (error) {
                                    console.error("Failed to toggle status", error);
                                    event.setExtendedProp('status', currentStatus); // Revert
                                } else {
                                    fetchEvents(); // Ensure full sync
                                }
                            } else {
                                setSelectedEvent(event);
                            }
                        }}
                        initialView={isMobile ? 'listDay' : 'timeGridWeek'}
                    />
                </div>

                {/* Sidebar / Drawer */}
                <div className={`schedule-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
                <TaskSidebar
                    onTaskUpdate={sidebarRefreshTrigger}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onTaskClick={(task) => {
                        // On mobile: Open modal to schedule this task
                        setSidebarOpen(false); // Close drawer

                        // Create a temporary event object to preset the modal
                        const now = new Date();
                        const nextHour = new Date(now);
                        nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Next full hour

                        setSelectedEvent({
                            id: task.id,
                            title: task.title,
                            start: nextHour.toISOString(),
                            end: new Date(nextHour.getTime() + 60 * 60000).toISOString(),
                            extendedProps: {
                                type: 'study_session', // Convert to study session
                                is_persistent: true,
                                status: 'pending'
                            },
                            // Flag to tell Modal this is an existing task being scheduled, not a new event
                            isTaskConversion: true
                        });
                    }}
                />

            </div>

            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onUpdate={() => { fetchEvents(); setSelectedEvent(null); }}
                    onDelete={() => { fetchEvents(); setSelectedEvent(null); }}
                />
            )}
        </ScheduleLayout>
    );
};

export default Schedule;
