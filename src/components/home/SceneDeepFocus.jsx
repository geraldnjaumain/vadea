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
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    letterSpacing: '-0.03em'
                }}>
                    Your AI
                    <br />
                    <span style={{ color: 'var(--color-electric-lime)' }}>Study Buddy</span>
                </h2>

                {/* Subtext */}
                <p style={{
                    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                    color: '#94A3B8',
                    maxWidth: '600px',
                    margin: '0 auto 48px',
                    lineHeight: 1.6
                }}>
                    Ask questions about your notes. Get instant explanations.
                    <br />
                    Learn faster with AI that understands your materials.
                </p>

                {/* Chat Preview */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '500px',
                    margin: '0 auto',
                    textAlign: 'left'
                }}>
                    {/* User Message */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            background: 'var(--color-electric-lime)',
                            color: 'var(--color-obsidian)',
                            padding: '12px 18px',
                            borderRadius: '16px 16px 4px 16px',
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            maxWidth: '80%'
                        }}>
                            Explain wave-particle duality
                        </div>
                    </div>

                    {/* AI Response */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: 'white',
                            padding: '16px 18px',
                            borderRadius: '16px 16px 16px 4px',
                            fontSize: '0.9375rem',
                            lineHeight: 1.6,
                            maxWidth: '85%'
                        }}>
                            <p style={{ margin: '0 0 12px 0' }}>
                                Based on your physics notes, wave-particle duality means that particles like electrons exhibit both wave and particle properties.
                            </p>
                            <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.8125rem' }}>
                                📖 From: Physics 101 - Lecture 4
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SceneDeepFocus;
