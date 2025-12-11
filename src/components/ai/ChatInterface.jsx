import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Paperclip, ArrowUp, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatInterface = ({ isSidebar = false }) => {
    const { user } = useAuth();
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize Gemini (Client Side for Robustness)
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handlePromptClick = (prompt) => {
        setInput(prompt);
        // Optional: Auto-submit? Let's just set input
        // handleSubmit(null, prompt); 
    };

    const handleSubmit = async (e, overrideInput) => {
        if (e) e.preventDefault();
        const textToSend = overrideInput || input;

        if (!textToSend.trim() || isLoading) return;

        const userMsg = { id: Date.now(), role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Prepare history (limit context window if needed)
            // Gemini API format: { role: 'user' | 'model', parts: [{ text: ... }] }
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const aiMsgId = Date.now() + 1;
            setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

            const result = await chat.sendMessageStream(textToSend);

            let accumulatedText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumulatedText += chunkText;

                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, content: accumulatedText } : msg
                ));
            }

        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className={`ai-main ${isSidebar ? 'sidebar-mode' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Chat Stream */}
            <div className="chat-stream" ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: isSidebar ? '12px' : '24px' }}>
                {messages.length === 0 ? (
                    <div className="ai-empty-state" style={{ marginTop: isSidebar ? '40px' : '80px', transform: isSidebar ? 'scale(0.9)' : 'none' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', margin: '0 auto' }}>
                            <Sparkles size={32} color="#cbd5e1" />
                        </div>
                        <h2 style={{ fontSize: isSidebar ? '1.2rem' : '1.5rem', fontWeight: 600, color: '#334155', marginBottom: '8px', textAlign: 'center' }}>Lab Partner</h2>
                        <p style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto', marginBottom: '24px' }}>
                            {isSidebar ? "Analyze notes & brainstorm." : "I can help you review your notes, solve math problems, or brainstorm essay topics."}
                        </p>

                        <div className={`prompt-grid ${isSidebar ? 'sidebar-grid' : ''}`} style={{ display: 'grid', gridTemplateColumns: isSidebar ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                            <div className="prompt-card" onClick={() => handlePromptClick("Quiz me on my notes.")}>Quiz me on my notes.</div>
                            <div className="prompt-card" onClick={() => handlePromptClick("Summarize this topic.")}>Summarize this topic.</div>
                        </div>
                    </div>
                ) : (
                    messages.map(msg => (
                        <MessageBubble key={msg.id} role={msg.role} content={msg.content} compact={isSidebar} />
                    ))
                )}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="message-row ai" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Sparkles size={14} fill="var(--color-electric-lime)" color="var(--color-ink-blue)" />
                        </div>
                        <div className="message-bubble ai" style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>Thinking...</div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="ai-input-container" style={{ padding: isSidebar ? '12px' : '24px', borderTop: isSidebar ? '1px solid #e2e8f0' : 'none' }}>
                <div className="ai-input-bar" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {!isSidebar && (
                        <button style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                            <Paperclip size={20} />
                        </button>
                    )}

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isSidebar ? "Ask AI..." : "Ask anything..."}
                        rows={1}
                        className="ai-textarea"
                        style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', padding: '8px', fontSize: '0.95rem', fontFamily: 'inherit', maxHeight: '120px' }}
                    />

                    <button
                        onClick={(e) => handleSubmit(e)}
                        disabled={!input.trim() || isLoading}
                        className={`ai-send-btn ${input.trim() ? 'active' : ''}`}
                        style={{
                            background: input.trim() ? 'var(--color-ink-blue)' : '#f1f5f9',
                            color: input.trim() ? 'var(--color-electric-lime)' : '#cbd5e1',
                            border: 'none',
                            borderRadius: '8px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: input.trim() ? 'pointer' : 'default',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoading ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <ArrowUp size={20} />}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ChatInterface;
