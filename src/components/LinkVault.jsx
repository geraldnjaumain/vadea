import React from 'react';
import { motion } from 'framer-motion';

const Icons = {
    Links: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8284 10.1716L16.6569 7.34315C18.219 5.78097 18.219 3.24835 16.6569 1.68617C15.0948 0.123996 12.5621 0.123996 11 1.68617L8.17157 4.51461M10.1716 13.8284L7.34315 16.6569C5.78097 18.219 3.24835 18.219 1.68617 16.6569C0.123996 15.0948 0.123996 12.5621 1.68617 11L4.5146 8.17158M7.3435 12.6565L11.5861 8.41387" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Research: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 21H14C14.7956 21 15.5587 20.6839 16.1213 20.1213C16.6839 19.5587 17 18.7956 17 18V16C17 15.2044 16.6839 14.4413 16.1213 13.8787C15.5587 13.3161 14.7956 13 14 13H10C9.20435 13 8.44129 13.3161 7.87868 13.8787C7.31607 14.4413 7 15.2044 7 16V18C7 18.7956 7.31607 19.5587 7.87868 20.1213C8.44129 20.6839 9.20435 21 10 21Z" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 13V3" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 5L12 3L14 5" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 21H19" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Schedule: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2V6" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 2V6" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10H21" stroke="#0B1120" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Arrow: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};

const LinkVault = () => {
    const cards = [
        {
            title: 'Class Links',
            Icon: Icons.Links,
            desc: 'One-click access to all your Zoom links and portals, organized automatically.'
        },
        {
            title: 'Research Papers',
            Icon: Icons.Research,
            desc: 'Auto-organized library of every citation and PDF you’ve used this semester.'
        },
        {
            title: 'Schedule',
            Icon: Icons.Schedule,
            desc: 'A visual timeline of your day that syncs with your notes and deadlines.'
        },
    ];

    return (
        <section className="section-vault" style={{ backgroundColor: '#f9fafb' }}>
            <div className="container">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="mb-2">The Link Vault</h2>
                    <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>Everything you need. Neat and Tidy.</p>
                </motion.div>

                <div className="grid-3">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            className="vault-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        >
                            <div className="arrow-icon">
                                <Icons.Arrow />
                            </div>
                            <div className="icon-box">
                                <card.Icon />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{card.title}</h3>
                            <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{card.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LinkVault;
