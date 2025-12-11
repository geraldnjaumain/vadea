import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

const TIPS = [
    "Explain a concept to a friend to master it (The Feynman Technique).",
    "Study in 25-minute chunks with 5-minute breaks (Pomodoro).",
    "Sleep is when your brain consolidates memory. Don't skip it!",
    "Active recall: Test yourself instead of re-reading.",
    "Space out your review sessions (Spaced Repetition).",
    "Drink water. Your brain is 73% water.",
    "Turn off phone notifications to reach a 'Flow State'."
];

const DailyTipWidget = () => {
    const [tip, setTip] = useState("");

    useEffect(() => {
        // Random tip for the session
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }, []);

    return (
        <div className="col-span-12" style={{
            background: 'linear-gradient(90deg, #ecfeff 0%, #ffffff 100%)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid #cffafe'
        }}>
            <div style={{ padding: '8px', background: 'white', borderRadius: '50%', color: '#0891b2' }}>
                <Lightbulb size={20} />
            </div>
            <div>
                <strong style={{ color: '#0891b2', marginRight: '8px' }}>Pro Tip:</strong>
                <span style={{ color: '#475569' }}>{tip}</span>
            </div>
        </div>
    );
};

export default DailyTipWidget;
