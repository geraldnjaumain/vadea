import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FolderOpen, Search, Zap, LayoutGrid } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SceneTransformation = () => {
    const sectionRef = useRef(null);
    const beforeRef = useRef(null);
    const afterRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=800",
                    pin: true,
                    scrub: 0.5
                }
            });

            // Crossfade: Before fades out, After fades in
            tl.to(beforeRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 1,
                ease: "power2.inOut"
            })
                .fromTo(afterRef.current,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
                    "<0.3"
                );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const features = [
        { icon: FolderOpen, title: 'Smart Folders', desc: 'Auto-sorted by course' },
        { icon: Search, title: 'Instant Search', desc: 'Find anything fast' },
        { icon: Zap, title: 'AI Tags', desc: 'Auto-categorized' },
        { icon: LayoutGrid, title: 'One Dashboard', desc: 'Everything unified' },
    ];

    return (
        <section ref={sectionRef} style={{
            height: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--color-obsidian)'
        }}>

            {/* BEFORE State */}
            <div ref={beforeRef} style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-paper-white)',
                padding: '40px'
            }}>
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-obsidian)',
                    textAlign: 'center',
                    lineHeight: 1.1,
                    marginBottom: '16px',
                    letterSpacing: '-0.03em'
                }}>
                    File Chaos?
                </h2>
                <p style={{
                    fontSize: '1.125rem',
                    color: 'var(--color-text-slate)',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    PDFs, notes, lectures scattered everywhere.
                </p>
            </div>

            {/* AFTER State */}
            <div ref={afterRef} style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-obsidian)',
                padding: '40px',
                opacity: 0
            }}>
                <div style={{ maxWidth: '800px', width: '100%' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 800,
                            fontFamily: 'var(--font-heading)',
                            color: 'white',
                            lineHeight: 1.1,
                            marginBottom: '16px',
                            letterSpacing: '-0.03em'
                        }}>
                            <span style={{ color: 'var(--color-electric-lime)' }}>Organized.</span> Instantly.
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#94A3B8',
                            maxWidth: '400px',
                            margin: '0 auto'
                        }}>
                            Your files, notes, and resources in one place.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '20px 24px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.06)'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'var(--color-electric-lime)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <feature.icon size={20} color="var(--color-obsidian)" />
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: 'white',
                                        marginBottom: '2px'
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </section>
    );
};

export default SceneTransformation;
