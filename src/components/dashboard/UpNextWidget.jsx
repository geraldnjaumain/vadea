import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UpNextWidget = () => {
    const { user } = useAuth();
    const [nextEvent, setNextEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchNext = async () => {
            const now = new Date().toISOString();
            // Fetch next event: pending, starting >= now (or ongoing?)
            // Actually, "Up Next" usually implies future.

            // Note: RLS or column existence errors might occur if migration not run.
            const { data } = await supabase
                .from('events')
                .select('*')
                .eq('user_id', user.id)
                .or(`status.eq.pending,status.is.null`) // Handle legacy nulls as pending
                .gte('start_time', now)
                .order('start_time', { ascending: true })
                .limit(1)
                .maybeSingle();

            if (data) setNextEvent(data);
        };
        fetchNext();
    }, [user]);

    const handleAction = () => {
        if (!nextEvent) {
            navigate('/app/schedule');
            return;
        }

        if (nextEvent.type === 'class' && nextEvent.url) {
            window.open(nextEvent.url, '_blank');
        } else if (nextEvent.type === 'task' || nextEvent.type === 'deadline') {
            // Navigate to note or just schedule for now
            navigate('/app/notes'); // Simplified as per spec "Navigates to Note"
        } else {
            navigate('/app/schedule');
        }
    };

    const getTimeBadge = () => {
        if (!nextEvent) return null;
        const diff = new Date(nextEvent.start_time) - new Date();
        const mins = Math.max(0, Math.floor(diff / 60000));

        if (mins < 60) return `${mins}m`;
        return `${Math.floor(mins / 60)}h`;
    };

    return (
        <div className="bento-card col-span-12 md:col-span-8" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px', position: 'relative', overflow: 'hidden' }}>
            {/* Background Accent for Classes */}
            {nextEvent?.type === 'class' && (
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, #e0f2fe 0%, transparent 70%)', opacity: 0.5 }}></div>
            )}

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748B', textTransform: 'uppercase' }}>
                        {nextEvent ? 'Up Next' : 'Status'}
                    </div>
                    {nextEvent && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-blue)', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                            Starts in {getTimeBadge()}
                        </span>
                    )}
                </div>

                {nextEvent ? (
                    <>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--color-ink-blue)', lineHeight: 1.1 }}>{nextEvent.title}</h2>
                        <div style={{ color: '#64748B', fontWeight: 500, fontSize: '1.1rem' }}>
                            {new Date(nextEvent.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {nextEvent.course || 'General'}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--color-ink-blue)' }}>You're free!</h2>
                        <p style={{ color: '#64748B' }}>No upcoming events. Time to study or relax.</p>
                    </>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-primary"
                    onClick={handleAction}
                    style={{
                        backgroundColor: nextEvent?.type === 'class' ? 'var(--color-electric-lime)' : 'var(--color-ink-blue)',
                        color: nextEvent?.type === 'class' ? 'var(--color-ink-blue)' : 'white'
                    }}
                >
                    {nextEvent ? (nextEvent.type === 'class' ? 'Join Class' : 'Open Work') : 'Plan Session'}
                </button>
            </div>
        </div>
    );
};

export default UpNextWidget;
