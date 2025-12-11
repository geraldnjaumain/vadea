import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProblemSolution = () => {
    const [sliderValue, setSliderValue] = useState(50);

    return (
        <section style={{ padding: '120px 0', backgroundColor: '#0f172a', color: 'white', overflow: 'hidden' }}>
            <div className="container text-center mb-8">
                <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>From Chaos to Clarity.</h2>
                <p style={{ color: '#94a3b8' }}>Drag the slider to organize your life.</p>
            </div>

            <div className="container" style={{ position: 'relative', height: '600px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #334155' }}>
                {/* AFTER Image (Background) */}
                <img
                    src="/dashboard-dark.png"
                    alt="Vadea Organized Dashboard"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* BEFORE Image (Foreground - Clipped) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${sliderValue}%`,
                    height: '100%',
                    overflow: 'hidden',
                    borderRight: '2px solid #D4FF00',
                    backgroundColor: '#1e293b' // Fallback
                }}>
                    <img
                        src="/chaos-desktop.png"
                        alt="Chaotic Student Desktop"
                        style={{
                            width: '100vw', // Needed to keep image static while container shrinks
                            maxWidth: '1200px', // Match container width roughly
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'left'
                        }}
                    />
                    <div style={{ position: 'absolute', top: '50%', left: '20px', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: '8px', color: 'white', fontWeight: 700 }}>THE CHAOS</div>
                </div>

                {/* Slider Handle */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(e.target.value)}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '-2%', // Offset to cover edges
                        width: '104%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'ew-resize',
                        zIndex: 20
                    }}
                />

                {/* Visual Thumb */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${sliderValue}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#D4FF00',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    boxShadow: '0 0 20px rgba(212, 255, 0, 0.5)',
                    pointerEvents: 'none'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8L22 12L18 16" />
                        <path d="M6 8L2 12L6 16" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
