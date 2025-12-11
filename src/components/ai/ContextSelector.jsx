import React, { useState, useEffect } from 'react';
import { File, FileText, X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ContextSelector.css';

const ContextSelector = ({ selectedContext, onContextChange }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        if (!user || !isOpen) return;

        const fetchContent = async () => {
            // Fetch notes
            const { data: notesData } = await supabase
                .from('notes')
                .select('id, title, folder')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(20);

            // Fetch vault files
            const { data: resourcesData } = await supabase
                .from('resources')
                .select('id, title, type')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            setNotes(notesData || []);
            setResources(resourcesData || []);
        };

        fetchContent();
    }, [user, isOpen]);

    const toggleItem = (type, id) => {
        const key = `${type}:${id} `;
        const newContext = selectedContext.includes(key)
            ? selectedContext.filter(item => item !== key)
            : [...selectedContext, key];
        onContextChange(newContext);
    };

    const isSelected = (type, id) => selectedContext.includes(`${type}:${id} `);

    return (
        <div className="context-selector">
            <button
                className="context-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <File size={18} />
                <span>Context ({selectedContext.length})</span>
            </button>

            {isOpen && (
                <div className="context-dropdown">
                    <div className="context-header">
                        <h3>Select Context</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="context-section">
                        <h4>Recent Notes</h4>
                        {notes.map(note => (
                            <div
                                key={note.id}
                                className={`context - item ${isSelected('note', note.id) ? 'selected' : ''} `}
                                onClick={() => toggleItem('note', note.id)}
                            >
                                <FileText size={16} />
                                <div className="context-item-info">
                                    <div className="context-item-title">{note.title}</div>
                                    <div className="context-item-subtitle">{note.folder}</div>
                                </div>
                                {isSelected('note', note.id) && <Check size={16} />}
                            </div>
                        ))}
                    </div>

                    <div className="context-section">
                        <h4>Vault Resources</h4>
                        {resources.map(resource => (
                            <div
                                key={resource.id}
                                className={`context - item ${isSelected('resource', resource.id) ? 'selected' : ''} `}
                                onClick={() => toggleItem('resource', resource.id)}
                            >
                                <File size={16} />
                                <div className="context-item-info">
                                    <div className="context-item-title">{resource.title}</div>
                                    <div className="context-item-subtitle">{resource.type}</div>
                                </div>
                                {isSelected('resource', resource.id) && <Check size={16} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContextSelector;
