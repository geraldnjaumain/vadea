import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const questions = [
    {
        q: "Is Vadea helpful for non-STEM majors?",
        a: "Absolutely. While we optimize for heavy workloads like Engineering and Med, any student balancing assignments, exams, and a social life will find Vadea life-changing."
    },
    {
        q: "How does the AI Study Buddy work?",
        a: "It reads your uploaded PDFs, slides, and notes. You can then ask it specific questions, generating quizzes or summaries instantly. It's like a TA that never sleeps."
    },
    {
        q: "Can I sync with Google Calendar?",
        a: "Yes. Use our 'Quick Capture' to drag events onto your timeline, and we'll sync two-way with your primary Google Calendar so you never miss a lecture."
    },
    {
        q: "Is there a student discount?",
        a: "Vadea is free for your first semester. After that, it's $5/month—less than a single coffee."
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="v4-faq-section py-32 bg-[var(--color-paper-white)] relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="v4-section-heading text-5xl font-[var(--font-heading)] font-bold mb-6 text-[var(--color-obsidian)]">
                        Common Questions
                    </h2>
                    <p className="v4-section-sub text-xl text-[var(--color-text-slate)]">
                        Everything you need to know about the product.
                    </p>
                </div>

                <div className="space-y-4">
                    {questions.map((item, idx) => (
                        <div
                            key={idx}
                            className="v4-faq-item border border-gray-200 rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                className="v4-faq-question w-full flex items-center justify-between p-8 text-left focus:outline-none"
                            >
                                <span className="text-xl font-bold text-[var(--color-obsidian)] font-[var(--font-body)]">
                                    {item.q}
                                </span>
                                <div className={`p-2 rounded-full transition-colors ${activeIndex === idx ? 'bg-[var(--color-electric-lime)]' : 'bg-gray-100'}`}>
                                    {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="v4-faq-answer px-8 pb-8 text-lg text-gray-500 leading-relaxed max-w-2xl">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
