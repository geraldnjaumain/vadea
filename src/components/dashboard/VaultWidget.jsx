import React, { useState, useEffect } from 'react';
import { Folder } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VaultWidget = () => {
    const { user } = useAuth();
    const [folders, setFolders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const fetchFolders = async () => {
            // Basic implementation: fetch distinct first tags
            const { data } = await supabase.from('resources').select('tags').eq('user_id', user.id);
            if (data) {
                const allTags = data.flatMap(r => r.tags || []);
                const unique = [...new Set(allTags)].slice(0, 4); // Top 4
                setFolders(unique.length ? unique : ['Math', 'History', 'Personal']);
            }
        };
        fetchFolders();
    }, [user]);

    return (
        <div className="bento-card col-span-12 md:col-span-6" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-ink-blue)' }}>Quick Vault</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '16px', flex: 1, alignItems: 'center' }}>
                {folders.map((folder, idx) => (
                    <div key={idx} onClick={() => navigate('/app/vault')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                            <Folder size={28} />
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569', textAlign: 'center' }}>{folder}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VaultWidget;
