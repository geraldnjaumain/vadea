import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const SceneDeepFocus = () => {
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Pin the Section
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=1500",
                pin: true,
                anticipatePin: 1
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=1500",
                    scrub: 1,
                }
            });

            // 2. Typewriter Effect
            tl.to(cursorRef.current, {
                opacity: 1,
                duration: 0.1
            })
                .to(textRef.current, {
                    text: {
                        value: "Quantum Mechanics\n\n- Wave-particle duality\n- Heisenberg uncertainty principle\n- Quantum superposition",
                        delimiter: ""
                    },
                    duration: 5,
                    ease: "none"
                });

            // Blinking cursor
            gsap.to(cursorRef.current, {
                opacity: 0,
                repeat: -1,
                yoyo: true,
                duration: 0.5,
                ease: "steps(1)"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            style={{
                height: '100vh',
                width: '100%',
                background: 'var(--color-obsidian)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '400px',
                height: '400px',
                background: 'var(--color-electric-lime)',
                borderRadius: '50%',
                filter: 'blur(150px)',
                opacity: 0.15,
                pointerEvents: 'none'
            }}></div>

            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '600px',
                width: '100%',
                margin: '0 16px'
            }}>
                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '48px',
                    minHeight: '280px'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '32px'
                    }}>
                        <Sparkles size={18} color="var(--color-electric-lime)" />
                        <span style={{
                            color: 'var(--color-electric-lime)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            AI Study Buddy
                        </span>
                    </div>

                    {/* Typewriter Content */}
                    <div style={{
                        fontFamily: 'monospace',
                        fontSize: 'clamp(1rem, 3vw, 1.375rem)',
                        color: 'white',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-line',
                        minHeight: '150px'
                    }}>
                        <span ref={textRef}></span>
                        <span
                            ref={cursorRef}
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '24px',
                                background: 'var(--color-electric-lime)',
                                marginLeft: '4px',
                                verticalAlign: 'middle'
                            }}
                        ></span>
                    </div>
                </div>

                {/* Footer Text */}
                <p style={{
                    textAlign: 'center',
                    color: '#64748B',
                    marginTop: '32px',
                    fontSize: '1rem'
                }}>
                    Your AI-powered <span style={{ color: 'white' }}>study companion.</span>
                </p>
            </div>
        </section>
    );
};

export default SceneDeepFocus;
