import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Quote } from 'lucide-react';

const reviews = [
    {
        name: "Sarah J.",
        role: "Med Student",
        text: "Vadea's Vault feature saved my GPA this semester. The AI summaries are incredibly accurate."
    },
    {
        name: "Marcus C.",
        role: "CS Major",
        text: "The cleanest productivity app I've ever used. It actually makes me want to stay organized."
    },
    {
        name: "Jessica L.",
        role: "Law Student",
        text: "Finally, an app that connects my calendar, files, and notes seamlessly."
    }
];

const Testimonials = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardsRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power3.out",
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

    return (
        <section
            ref={containerRef}
            style={{
                padding: '120px 24px',
                background: 'var(--color-paper-white)'
            }}
        >
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-obsidian)',
                        lineHeight: 1.1,
                        marginBottom: '16px',
                        letterSpacing: '-0.03em'
                    }}>
                        What Students Say
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: 'var(--color-text-slate)',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        Trusted by students at top universities.
                    </p>
                </div>

                {/* Testimonials Grid with staggered animation */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            ref={addToRefs}
                            style={{
                                padding: '32px',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid rgba(0,0,0,0.06)',
                                transition: 'transform 0.3s ease, border-color 0.3s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'var(--color-electric-lime)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                            }}
                        >
                            {/* Quote Icon */}
                            <Quote
                                size={24}
                                style={{
                                    color: 'var(--color-electric-lime)',
                                    marginBottom: '16px'
                                }}
                            />

                            {/* Quote Text */}
                            <p style={{
                                fontSize: '1rem',
                                lineHeight: 1.7,
                                color: 'var(--color-obsidian)',
                                marginBottom: '24px'
                            }}>
                                "{review.text}"
                            </p>

                            {/* Author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--color-obsidian)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-electric-lime)',
                                    fontWeight: 700,
                                    fontSize: '0.875rem'
                                }}>
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 style={{
                                        fontWeight: 600,
                                        color: 'var(--color-obsidian)',
                                        fontSize: '0.9375rem'
                                    }}>
                                        {review.name}
                                    </h4>
                                    <p style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--color-text-slate)'
                                    }}>
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
