import React, { useEffect, useState } from 'react';
import { FileText, Paperclip, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecentActivityWidget = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchRecent = async () => {
            // Fetch Notes
            const { data: notes } = await supabase
                .from('notes')
                .select('id, title, updated_at')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(3);

            // Fetch Resources
            const { data: resources } = await supabase
                .from('resources')
                .select('id, title, type, created_at') // resources use created_at mostly? or updated_at? let's use created_at if updated null
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3);

            // Merge & Sort
            const combined = [
                ...(notes || []).map(n => ({ ...n, itemType: 'note', date: n.updated_at })),
                ...(resources || []).map(r => ({ ...r, itemType: r.type, date: r.created_at }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 4);

            setItems(combined);
        };
        fetchRecent();
    }, [user]);

    const getIcon = (type) => {
        if (type === 'note') return <FileText size={20} />;
        if (type === 'link') return <LinkIcon size={20} />;
        return <Paperclip size={20} />;
    };

    const handleClick = (item) => {
        if (item.itemType === 'note') navigate('/app/notes'); // specific note deep link later
        else navigate('/app/vault');
    };

    return (
        <div className="bento-card col-span-12 md:col-span-6" style={{ padding: '24px', height: '100%', minHeight: '240px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-ink-blue)' }}>Recent Flow</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No recent activity.</div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleClick(item)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ color: '#64748B' }}>{getIcon(item.itemType)}</div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivityWidget;
