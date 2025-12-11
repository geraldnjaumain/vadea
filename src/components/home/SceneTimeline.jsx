import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Clock, Book, Coffee, Dumbbell } from 'lucide-react';

const SceneTimeline = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardsRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    const timeBlocks = [
        { time: '9:00 AM', title: 'Deep Work', subtitle: 'Algorithm Practice', icon: Clock },
        { time: '11:00 AM', title: 'Physics 101', subtitle: 'Lecture + Notes', icon: Book },
        { time: '12:30 PM', title: 'Lunch Break', subtitle: 'Recharge', icon: Coffee },
        { time: '2:00 PM', title: 'Gym Session', subtitle: 'Workout', icon: Dumbbell },
    ];

    return (
        <section
            ref={containerRef}
            style={{
                minHeight: '100vh',
                width: '100%',
                background: 'var(--color-paper-white)',
                padding: '120px 0',
                position: 'relative'
            }}
        >
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        marginBottom: '16px',
                        color: 'var(--color-obsidian)',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1.1
                    }}>
                        Master Your Time
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: 'var(--color-text-slate)',
                        maxWidth: '480px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        AI-powered scheduling that adapts to your workflow.
                    </p>
                </div>

                {/* Clean Timeline List */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    {timeBlocks.map((block, index) => (
                        <div
                            key={index}
                            ref={addToRefs}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '24px',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid rgba(0,0,0,0.06)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(8px)';
                                e.currentTarget.style.borderColor = 'var(--color-electric-lime)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'var(--color-obsidian)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <block.icon size={22} color="var(--color-electric-lime)" />
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                    color: 'var(--color-obsidian)',
                                    marginBottom: '4px'
                                }}>
                                    {block.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--color-text-slate)'
                                }}>
                                    {block.subtitle}
                                </p>
                            </div>

                            {/* Time */}
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'var(--color-text-slate)',
                                background: 'var(--color-paper-white)',
                                padding: '8px 12px',
                                borderRadius: '8px'
                            }}>
                                {block.time}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default SceneTimeline;
