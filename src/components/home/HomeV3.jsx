import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import SceneHero from './SceneHero';
import SceneTransformation from './SceneTransformation';
import SceneDeepFocus from './SceneDeepFocus';
import SceneTimeline from './SceneTimeline';
import ScenePortal from './ScenePortal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Navbar from '../Navbar';
import Footer from '../Footer';
import SocialProof from '../SocialProof';
import FAQ from './FAQ';
import Testimonials from './Testimonials';
import '../../styles/HomeV4.css'; // Import the new safety net CSS

const HomeV3 = () => {

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return (
        <main
            className="home-v4-root w-full min-h-screen" // Applied V4 Root Class
            onContextMenu={(e) => e.preventDefault()}
        >
            <Navbar />

            <SceneHero />

            {/* Trust Section */}
            <SocialProof />

            <SceneTransformation />

            {/* Testimonials (Dark Mode Bridge) */}
            <Testimonials />

            <SceneDeepFocus />
            <SceneTimeline />

            <FAQ />
            <ScenePortal />

            <Footer />
        </main>
    );
};

export default HomeV3;
