import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import UpNextWidget from '../components/dashboard/UpNextWidget';
import QuickCaptureWidget from '../components/dashboard/QuickCaptureWidget';
import RecentActivityWidget from '../components/dashboard/RecentActivityWidget';
import VaultWidget from '../components/dashboard/VaultWidget';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

import DailyTipWidget from '../components/dashboard/DailyTipWidget';

const Dashboard = () => {
    // ... (existing state) ...
    const { user } = useAuth();
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

    const [stats, setStats] = useState({ classes: 0, assignments: 0 });
    const [firstName, setFirstName] = useState('Student');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        setFirstName(user.user_metadata?.full_name?.split(' ')[0] || 'Student');

        const fetchStats = async () => {
            const today = new Date().toISOString().split('T')[0];
            try {
                // Parallel fetching logic here if needed, but for stats simple counts are fine
                // In a real optimized app, we'd use Promise.all for widgets too, but widgets fetch themselves

                // Count Classes Today
                const { count: classCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('type', 'class').gte('start_time', `${today}T00:00:00`).lt('start_time', `${today}T23:59:59`);

                // Count Assignments
                const { count: assignmentCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending').eq('type', 'deadline').gte('start_time', `${today}T00:00:00`).lt('start_time', `${today}T23:59:59`);

                setStats({ classes: classCount || 0, assignments: assignmentCount || 0 });
            } catch (err) { console.error(err); }
        };
        fetchStats();
    }, [user]);

    return (
        <DashboardLayout>
            <div className="bento-grid" style={{ paddingBottom: '80px' }}>

                {/* Header */}
                <div className="col-span-12" style={{ marginBottom: '8px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--color-ink-blue)' }}>{greeting}, {firstName}.</h1>
                    <p style={{ fontSize: '1.125rem', color: '#64748B' }}>
                        You have <strong style={{ color: 'var(--color-ink-blue)' }}>{stats.classes} classes</strong> and <strong style={{ color: 'var(--color-ink-blue)' }}>{stats.assignments} assignments</strong> due today.
                    </p>
                </div>

                {/* Daily Tip Banner */}
                <DailyTipWidget />

                {/* Row 1: Up Next (2/3) + Quick Capture (1/3) */}
                <UpNextWidget />
                <QuickCaptureWidget />

                {/* Row 2: Recent Activity + Vault */}
                <RecentActivityWidget />
                <VaultWidget />

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
