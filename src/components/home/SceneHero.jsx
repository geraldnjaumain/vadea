import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SceneHero = () => {
    const containerRef = useRef(null);
    const chaosRef = useRef(null);
    const orderRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 0. Initial State: Chaos is scattered
            const chaosChars = chaosRef.current.children;

            // Set initial scattered state for Chaos
            gsap.set(chaosChars, {
                x: (i) => (Math.random() - 0.5) * 400,
                y: (i) => (Math.random() - 0.5) * 200,
                rotation: (i) => (Math.random() - 0.5) * 90,
                opacity: 0,
                filter: "blur(10px)"
            });

            // 1. Load Animation: Snap to Grid (Motion with Meaning)
            const loadTl = gsap.timeline();
            loadTl.to(chaosChars, {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.5,
                ease: "elastic.out(1, 0.5)",
                stagger: 0.1
            });

            // 2. Scroll Animation: Quick fade transition
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=500",
                    scrub: 0.5,
                    pin: true
                }
            });

            // Chaos fades, Laptop reveals
            scrollTl.to(chaosRef.current, {
                opacity: 0,
                y: -100,
                duration: 1
            }, "start")
                .from(orderRef.current, {
                    opacity: 0,
                    y: 100,
                    scale: 1.5,
                    duration: 1
                }, "start")

                // 100-300px: Laptop/Computer reveals
                .fromTo(videoRef.current, {
                    y: 400,
                    rotationX: -20,
                    opacity: 0,
                    scale: 0.8
                }, {
                    y: 0,
                    rotationX: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power2.out"
                });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--color-paper-white)',
            paddingTop: '80px'
        }}>
            {/* Centered Typography */}
            <div style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
                <h1 style={{
                    fontSize: 'clamp(4rem, 15vw, 12rem)',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    fontFamily: 'Clash Display, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {/* CHAOS */}
                    <div ref={chaosRef} style={{ display: 'flex', gap: '0.1em' }}>
                        {'CHAOS'.split('').map((char, i) => (
                            <span key={i} style={{ display: 'inline-block', color: 'var(--color-text-slate)', opacity: 0.5 }}>
                                {char}
                            </span>
                        ))}
                    </div>

                    <span style={{
                        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                        fontWeight: 500,
                        letterSpacing: '0.3em',
                        color: 'var(--color-text-slate)',
                        textTransform: 'uppercase',
                        margin: '24px 0'
                    }}>
                        meets
                    </span>

                    {/* ORDER */}
                    <div ref={orderRef} style={{ display: 'flex', gap: '0.1em' }}>
                        {'ORDER'.split('').map((char, i) => (
                            <span key={i} style={{ display: 'inline-block', color: 'var(--color-obsidian)' }}>
                                {char}
                            </span>
                        ))}
                    </div>
                </h1>

                <p style={{
                    marginTop: '48px',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                    color: 'var(--color-text-slate)',
                    maxWidth: '600px',
                    margin: '48px auto 0 auto',
                    fontWeight: 400,
                    lineHeight: 1.5
                }}>
                    The intelligent interface that organizes your academic life.
                </p>

                {/* CTA Buttons */}
                <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button style={{
                        padding: '16px 32px',
                        background: 'var(--color-electric-lime)',
                        color: 'var(--color-obsidian)',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        fontSize: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(212, 255, 0, 0.4)',
                        transition: 'all 0.2s'
                    }}>
                        Get Started Free
                    </button>
                    <button style={{
                        padding: '16px 32px',
                        background: 'white',
                        color: 'var(--color-obsidian)',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        fontSize: '16px',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                        Watch Demo
                    </button>
                </div>
            </div>

            {/* Hidden video ref for GSAP */}
            <div ref={videoRef} style={{ display: 'none' }}></div>
        </section>
    );
};

export default SceneHero;
