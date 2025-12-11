import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Sparkles, FileText, List, Heading, Code, Quote, Minus, Type } from 'lucide-react';
import '../../styles/SlashMenu.css';

const SlashMenu = ({ editor, onCommand, position }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef(null);

    const commands = [
        {
            id: 'heading1',
            title: 'Heading 1',
            description: 'Main section heading',
            icon: Heading,
            action: () => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                onCommand('close');
            },
        },
        {
            id: 'heading2',
            title: 'Heading 2',
            description: 'Subsection heading',
            icon: Type,
            action: () => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                onCommand('close');
            },
        },
        {
            id: 'bulletList',
            title: 'Bullet List',
            description: 'Simple bulleted list',
            icon: List,
            action: () => {
                editor.chain().focus().toggleBulletList().run();
                onCommand('close');
            },
        },
        {
            id: 'codeBlock',
            title: 'Code Block',
            description: 'Code snippet with highlighting',
            icon: Code,
            action: () => {
                editor.chain().focus().toggleCodeBlock().run();
                onCommand('close');
            },
        },
        {
            id: 'blockquote',
            title: 'Quote',
            description: 'Capture a quote',
            icon: Quote,
            action: () => {
                editor.chain().focus().toggleBlockquote().run();
                onCommand('close');
            },
        },
        {
            id: 'divider',
            title: 'Divider',
            description: 'Horizontal line',
            icon: Minus,
            action: () => {
                editor.chain().focus().setHorizontalRule().run();
                onCommand('close');
            },
        },
        {
            id: 'schedule',
            title: 'Add Deadline',
            description: 'Link a deadline to this note',
            icon: Calendar,
            action: () => onCommand('schedule'),
        },
        {
            id: 'summarize',
            title: 'Summarize',
            description: 'AI summary of your note',
            icon: Sparkles,
            action: () => onCommand('summarize'),
        },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % commands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                commands[selectedIndex].action();
            } else if (e.key === 'Escape') {
                onCommand('close');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, commands]);

    return (
        <div
            ref={menuRef}
            className="slash-menu"
            style={{
                position: 'fixed',
                top: position?.top || 0,
                left: position?.left || 0,
                zIndex: 9999, // Ensure it's above everything
                maxHeight: '300px',
                overflowY: 'auto'
            }}
        >
            {commands.map((command, index) => {
                const Icon = command.icon;
                return (
                    <button
                        key={command.id}
                        className={`slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => command.action()}
                        onMouseEnter={() => setSelectedIndex(index)}
                    >
                        <div className="slash-menu-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={16} />
                        </div>
                        <div className="slash-menu-content">
                            <div className="slash-menu-title">{command.title}</div>
                            <div className="slash-menu-description">{command.description}</div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default SlashMenu;
