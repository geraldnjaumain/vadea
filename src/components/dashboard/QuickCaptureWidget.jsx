import React, { useState } from 'react';
import { Zap, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const QuickCaptureWidget = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSave = async () => {
        if (!note.trim() || !user) return;
        setStatus('loading');

        try {
            const { error } = await supabase.from('notes').insert({
                user_id: user.id,
                title: 'Quick Note',
                folder: 'Inbox',
                content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: note }] }] } // Tiptap JSON format
            });

            if (error) throw error;

            setStatus('success');
            setNote('');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            console.error(err);
            toast.error('Failed to save note', err.message);
            setStatus('idle');
        }
    };

    return (
        <div className="bento-card card-dark col-span-12 md:col-span-4" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Quick Note</h3>
                <Zap size={24} />
            </div>

            <textarea
                placeholder="Type something..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                    resize: 'none',
                    outline: 'none',
                    marginBottom: '12px'
                }}
            ></textarea>

            <div style={{ textAlign: 'right' }}>
                <button
                    onClick={handleSave}
                    disabled={status === 'loading' || !note.trim()}
                    style={{
                        background: status === 'success' ? 'var(--color-electric-lime)' : 'white',
                        color: status === 'success' ? 'var(--color-ink-blue)' : 'var(--color-ink-blue)',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        transform: status === 'success' ? 'scale(1.05)' : 'scale(1)'
                    }}>
                    {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> :
                        status === 'success' ? <><Check size={16} /> Saved!</> : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default QuickCaptureWidget;
