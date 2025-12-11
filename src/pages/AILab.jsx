import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Paperclip, Send, FileText, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchContext } from '../lib/rag';
import Sidebar from '../components/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import '../styles/AILab.css';

const AILab = () => {
    // State
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeContexts, setActiveContexts] = useState([]); // List of {id, title}
    const [isVaultPickerOpen, setIsVaultPickerOpen] = useState(false); // To implement later
    const scrollRef = useRef(null);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // 1. Retrieval (RAG)
            // If contexts are selected, use them. If not, maybe search everything? 
            // For safety, let's search everything if nothing selected, or just semantic search active ones.
            // Spec implies "Active Context". Let's assume we search Active Contexts or All if empty (?).
            // Let's implement Search.

            const contextIds = activeContexts.length > 0 ? activeContexts.map(c => c.id) : null;
            const contextChunks = await searchContext(currentInput, contextIds);

            // 2. Prompt Assembly
            let systemPrompt = "You are Vadea's Study Buddy, a helpful academic tutor. Use the following Context to answer the user question. If the answer isn't in the context, use your general knowledge but mention that it's not in the notes. Formulate answers in Markdown. Use LaTeX for math.";

            if (contextChunks && contextChunks.length > 0) {
                systemPrompt += "\n\nCONTEXT:\n" + contextChunks.map((c, i) => `[${i + 1}] ${c.content}`).join("\n\n");
            } else {
                systemPrompt += "\n\nNo relevant context found in your notes.";
            }

            // 3. Generation
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const chat = model.startChat({
                history: [
                    // Convert previous messages to simplified history if needed, or key off just this turn for MVP
                    ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))
                ]
            });

            const result = await chat.sendMessage(systemPrompt + "\n\nUser Question: " + currentInput);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', content: text }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', content: "Sorry, I encountered an error creating your response." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />

            <div className="ai-lab-container" style={{ flex: 1 }}>

                {/* Left Pane: Context & History */}
                <div className="ai-sidebar">
                    <div className="active-brain-section">
                        <div className="section-label">
                            <span>Active Brain</span>
                            <button onClick={() => setIsVaultPickerOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--color-ink-blue)', cursor: 'pointer', fontSize: '1.25rem' }}>+</button>
                        </div>

                        {activeContexts.length === 0 ? (
                            <div style={{ fontSize: '0.875rem', color: '#cbd5e1', fontStyle: 'italic' }}>No files attached. Searching all knowledge.</div>
                        ) : (
                            activeContexts.map(ctx => (
                                <div key={ctx.id} className="context-chip">
                                    <FileText size={14} />
                                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ctx.title}</span>
                                    <button onClick={() => setActiveContexts(activeContexts.filter(c => c.id !== ctx.id))} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&times;</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="history-section">
                        <div className="section-label">History</div>
                        <div className="chat-history-item active">Current Session</div>
                        <div className="chat-history-item">Calculus Limits</div>
                        <div className="chat-history-item">History 101 Essay</div>
                    </div>
                </div>

                {/* Right Pane: Main Stage */}
                <div className="ai-main-stage">
                    <div className="chat-scroll-area" ref={scrollRef}>
                        <div className="chat-content-width">
                            {messages.length === 0 ? (
                                <div className="empty-state-grid">
                                    <div className="prompt-card" onClick={() => setInput("Quiz me on my active notes")}>
                                        <h4>Quiz Me</h4>
                                        <p>Generate a quiz based on attached files.</p>
                                    </div>
                                    <div className="prompt-card" onClick={() => setInput("Summarize the key concepts")}>
                                        <h4>Summarize</h4>
                                        <p>Get a quick overview of key concepts.</p>
                                    </div>
                                    <div className="prompt-card" onClick={() => setInput("Create a study plan")}>
                                        <h4>Study Plan</h4>
                                        <p>Build a schedule for the upcoming week.</p>
                                    </div>
                                    <div className="prompt-card" onClick={() => setInput("Explain like I'm 5")}>
                                        <h4>ELI5</h4>
                                        <p>Simplify complex topics.</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className={`message-row ${msg.role}`}>
                                        {msg.role === 'model' && (
                                            <div className="ai-icon-container">
                                                <Sparkles size={16} fill="var(--color-electric-lime)" color="var(--color-ink-blue)" />
                                            </div>
                                        )}
                                        <div className={`message-bubble ${msg.role}`}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="message-row model">
                                    <div className="ai-icon-container">
                                        <Sparkles size={16} />
                                    </div>
                                    <div className="message-bubble model" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                        Reading your notes...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating Input */}
                    <div className="floating-input-container">
                        <div className="attach-btn" onClick={() => setIsVaultPickerOpen(true)}>
                            <Paperclip size={20} />
                        </div>
                        <input
                            className="chat-input"
                            placeholder="Ask anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            className={`send-btn ${input.trim() ? 'active' : ''}`}
                            onClick={handleSendMessage}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AILab;
