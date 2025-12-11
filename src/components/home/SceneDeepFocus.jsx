import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SceneDeepFocus = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Simple fade in animation
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            style={{
                minHeight: '100vh',
                width: '100%',
                background: 'var(--color-obsidian)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '120px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Subtle background accent */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'var(--color-electric-lime)',
                borderRadius: '50%',
                filter: 'blur(200px)',
                opacity: 0.08,
                pointerEvents: 'none'
            }}></div>

            <div ref={textRef} style={{
                maxWidth: '900px',
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Main Heading */}
                {/* Main Heading */}
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    letterSpacing: '-0.03em'
                }}>
                    Never Study
                    <br />
                    <span style={{ color: 'var(--color-electric-lime)' }}>Alone Again</span>
                </h2>

                {/* Subtext */}
                <p style={{
                    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                    color: '#94A3B8',
                    maxWidth: '600px',
                    margin: '0 auto 48px',
                    lineHeight: 1.6
                }}>
                    It’s not just "AI"—it’s a study partner that knows your notes by heart.
                    <br />
                    Stuck at 2 AM? Get a friendly explanation, not a robot answer.
                </p>

                {/* Chat Preview */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px',
                    padding: '40px',
                    maxWidth: '540px',
                    margin: '0 auto',
                    textAlign: 'left',
                    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5)'
                }}>
                    {/* User Message */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            background: 'var(--color-electric-lime)',
                            color: 'var(--color-obsidian)',
                            padding: '16px 24px',
                            borderRadius: '20px 20px 4px 20px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            maxWidth: '85%',
                            boxShadow: '0 4px 12px rgba(212, 255, 0, 0.2)'
                        }}>
                            I still don't get this... can you explain it like I'm 5? 😩
                        </div>
                    </div>

                    {/* AI Response */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: 'white',
                            padding: '20px 24px',
                            borderRadius: '20px 20px 20px 4px',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            maxWidth: '90%',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <p style={{ margin: '0 0 16px 0' }}>
                                Don't sweat it! Think of it this way:
                            </p>
                            <p style={{ margin: '0 0 16px 0' }}>
                                Imagine the electron is like a shy dancer. When nobody is watching (measuring), it dances all over the floor at once (wave). But the moment you look at it, it freezes in one spot (particle).
                            </p>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '12px',
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                width: 'fit-content'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>💡</span>
                                <span style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500 }}>
                                    From: "Lecture 4: Quantum Weirdness"
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SceneDeepFocus;
