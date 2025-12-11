import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const ScenePortal = () => {
    const containerRef = useRef(null);
    const circleRef = useRef(null);
    const contentRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=1500",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // 1. Expand the Circle Portal
            tl.to(circleRef.current, {
                clipPath: 'circle(150% at 50% 50%)',
                duration: 2,
                ease: 'power2.inOut'
            })
                // 2. Change text color from dark to lime when portal expands
                .to(headingRef.current, {
                    color: '#D4FF00',
                    duration: 0.5
                }, "-=1.5")
                // 3. Fade in button
                .to(contentRef.current.querySelector('.portal-button'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                }, "-=0.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="v4-portal-section h-screen w-full relative overflow-hidden flex items-center justify-center bg-[var(--color-paper-white)]">

            {/* The Portal Background (Masked) */}
            <div
                ref={circleRef}
                className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#020617] to-black"
                style={{ clipPath: 'circle(10% at 50% 50%)' }}
            >
                {/* Background Starfield (CSS) */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-700"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[var(--color-electric-lime)] rounded-full animate-pulse delay-300"></div>
                    <div className="absolute top-1/3 right-10 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
                    <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
                    <div className="absolute top-20 right-1/2 w-0.5 h-0.5 bg-orange-200 rounded-full animate-pulse delay-200"></div>
                </div>

                {/* Background Decor - Radial Glow */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[var(--color-electric-lime)] rounded-full blur-[150px] opacity-10 mix-blend-screen animate-pulse duration-[5000ms]"></div>
                </div>
            </div>

            {/* Content - Text starts dark, becomes lime */}
            <div
                ref={contentRef}
                className="relative z-10 text-center px-4"
            >
                <h2
                    ref={headingRef}
                    className="v4-portal-heading text-[12vmin] font-black leading-[0.9] mb-12 font-[var(--font-heading)] tracking-tighter"
                    style={{ color: 'var(--color-obsidian)' }}
                >
                    Ready to<br />
                    Transcend?
                </h2>

                <div className="portal-button" style={{ opacity: 0, transform: 'translateY(20px)' }}>
                    <Link to="/signup" className="v4-btn-primary group relative inline-flex items-center justify-center px-16 py-8 bg-white text-[var(--color-obsidian)] rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                        <span className="relative z-10 font-bold text-2xl mr-2 tracking-tight">Enter Vadea</span>
                        <ArrowRight className="relative z-10 w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-[var(--color-electric-lime)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                </div>
            </div>

        </section>
    );
};

export default ScenePortal;
