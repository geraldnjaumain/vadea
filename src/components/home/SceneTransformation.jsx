import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-obsidian)',
                    textAlign: 'center',
                    lineHeight: 1,
                    letterSpacing: '-0.04em'
                }}>
                    File Chaos?
                </h2>
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
                <h2 style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    textAlign: 'center',
                    lineHeight: 1,
                    letterSpacing: '-0.04em'
                }}>
                    <span style={{ color: 'var(--color-electric-lime)' }}>Organized.</span>
                    <br />
                    Instantly.
                </h2>
            </div>

        </section>
    );
};

export default SceneTransformation;
