import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Sparkles, User, Copy, Check } from 'lucide-react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import '../../styles/CodeBlock.css';

const CodeBlock = ({ language, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block-wrapper">
            <div className="code-block-header">
                <span className="code-language">{language || 'code'}</span>
                <button onClick={handleCopy} className="code-copy-btn">
                    {copied ? (
                        <>
                            <Check size={14} />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre style={{ margin: 0, padding: '16px', overflowX: 'auto', background: '#282c34', color: '#abb2bf' }}>
                <code>{value}</code>
            </pre>
        </div>
    );
};

const MessageBubble = ({ role, content }) => {
    const isUser = role === 'user';

    return (
        <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
            {!isUser && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={16} fill="var(--color-electric-lime)" color="var(--color-ink-blue)" />
                </div>
            )}

            <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
                {isUser ? (
                    content
                ) : (
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <CodeBlock
                                        language={match[1]}
                                        value={String(children).replace(/\n$/, '')}
                                    />
                                ) : (
                                    <code className="inline-code" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                )}
            </div>

            {isUser && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-ink-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} color="white" />
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
