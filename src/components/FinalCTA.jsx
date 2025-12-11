import React from 'react';
import { motion } from 'framer-motion';

const FinalCTA = () => {
    return (
        <section className="section-cta" style={{
            backgroundColor: 'var(--color-ink-blue)',
            textAlign: 'center',
            color: 'white',
            overflow: 'hidden'
        }}>
            <div className="container">
                <motion.h2
                    style={{ color: 'white', marginBottom: '24px', fontSize: '3.5rem' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Stop switching apps. <br />Start learning.
                </motion.h2>
                <div style={{ marginTop: '48px' }}>
                    <motion.a
                        href="#"
                        className="btn btn-primary"
                        style={{ fontSize: '1.25rem', padding: '1.25rem 3rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Vadea Free
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
