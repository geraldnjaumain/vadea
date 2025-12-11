import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AISidebar = ({ isOpen, onClose, initialPrompt, context }) => {
    // Logic (Hidden from visual structure mostly)
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    const processedPromptRef = useRef(null); // Track processed prompts
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    // Handle initialPrompt auto-submission
    useEffect(() => {
        if (isOpen && initialPrompt && initialPrompt !== processedPromptRef.current) {
            processedPromptRef.current = initialPrompt;
            handleAutoSubmit(initialPrompt);
        }
    }, [isOpen, initialPrompt]);

    const handleAutoSubmit = async (text) => {
        if (isLoading) return;
        const userMsg = { id: Date.now(), role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Construct history with context if available
            let history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));

            // If context exists, inject it as a system-like message at start of history or current turn
            let textToSend = text;
            if (context && messages.length === 0) {
                // Initial context injection
                textToSend = `Context: ${context}\n\nUser Question: ${text}`;
            } else if (context) {
                // If chatting mid-stream, maybe just prepend to this message? 
                // Or rely on previous context? 
                // Simplest: Prepend context to the message, marking it as "Current Note Context"
                textToSend = `[Current Note Context]: ${context}\n\n${text}`;
            }

            const chat = model.startChat({ history: history });
            const result = await chat.sendMessage(textToSend);
            const response = await result.response;
            const responseText = response.text();

            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: responseText }]);
        } catch (error) {
            console.error(error);
            const errorMessage = error.message || "Connection error. Try again.";
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;
        const text = input;
        setInput('');

        // processing
        if (isLoading) return;
        const userMsg = { id: Date.now(), role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            // Construct history 
            let history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));

            let textToSend = text;
            // Inject context on first message or always? 
            // If history is empty, inject.
            if (context && messages.length === 0) {
                textToSend = `Context: ${context}\n\nUser Question: ${text}`;
            } else if (context) {
                // Lightweight reminder? Or full context?
                // Full context ensures AI knows current state of note.
                textToSend = `[Context]: ${context}\n\n${text}`;
            }

            const chat = model.startChat({ history: history });
            const result = await chat.sendMessage(textToSend);
            const response = await result.response;
            const responseText = response.text();

            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: responseText }]);
        } catch (error) {
            console.error(error);
            const errorMessage = error.message || "Connection error. Try again.";
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`notes-ai-sidebar ${!isOpen ? 'closed' : ''}`}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-ink-blue)' }}>
                    <Sparkles size={16} />
                    <span>Study Buddy</span>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    <X size={16} />
                </button>
            </div>

            {/* Content Area */}
            {messages.length === 0 ? (
                <div style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                    AI Context will appear here. <br />
                    "Quiz me on this note."
                </div>
            ) : (
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }} ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.role === 'user' ? '#e2e8f0' : '#f8fafc',
                            color: '#1e293b',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            maxWidth: '90%'
                        }}>
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && <Loader2 size={16} className="animate-spin" style={{ color: '#94a3b8' }} />}
                </div>
            )}

            {/* Input Area */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Ask AI..."
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-body)'
                    }}
                />
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    style={{ width: '40px', padding: 0, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default AISidebar;
