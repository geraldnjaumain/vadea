import React from 'react';
import { motion } from 'framer-motion';

const SocialProof = () => {
    const partners = ['Stanford', 'MIT', 'Harvard', 'Yale', 'Berkeley', 'Columbia'];

    return (
        <section style={{
            padding: '60px 0',
            background: 'var(--color-paper-white)',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    color: 'var(--color-text-slate)',
                    textTransform: 'uppercase'
                }}>
                    Trusted by students at
                </p>
            </div>

            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Gradient masks */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to right, var(--color-paper-white), transparent)', zIndex: 10 }}></div>
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to left, var(--color-paper-white), transparent)', zIndex: 10 }}></div>

                <motion.div
                    style={{ display: 'flex', gap: '80px', whiteSpace: 'nowrap' }}
                    animate={{ x: [0, -800] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    {[...partners, ...partners, ...partners].map((partner, index) => (
                        <span
                            key={`${partner}-${index}`}
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                fontFamily: 'Clash Display, sans-serif',
                                color: 'var(--color-text-slate)',
                                opacity: 0.6,
                                transition: 'color 0.2s'
                            }}
                        >
                            {partner}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default SocialProof;

