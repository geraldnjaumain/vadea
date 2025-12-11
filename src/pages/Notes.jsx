import React, { useState } from 'react';
import NotesLayout from '../layouts/NotesLayout';
import Editor from '../components/notes/Editor';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import NotesSidebar from '../components/notes/NotesSidebar'; // Need to pass props to this

const Notes = () => {
    const { user } = useAuth();
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState(null);

    const handleCreateNote = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('notes')
            .insert({ user_id: user.id, title: 'Untitled', content: {} })
            .select()
            .single();

        if (data) setActiveNoteId(data.id);
    };

    const handleSummarize = (content) => {
        // Construct prompt with content
        // Content is Tiptap JSON, we might want text, but for now let's assume Editor sends text or we treat it as JSON string
        // Better if Editor extracts text.
        const prompt = `Please summarize the following note:\n\n${content}`;
        setAiPrompt(prompt);
        setIsAiOpen(true);
    };

    return (
        <NotesLayout
            sidebar={<NotesSidebar activeNoteId={activeNoteId} onSelectNote={setActiveNoteId} onCreateNote={handleCreateNote} />}
            isAiOpen={isAiOpen}
            onAiClose={() => { setIsAiOpen(false); setAiPrompt(null); }}
            onAiToggle={() => setIsAiOpen(!isAiOpen)}
            aiPrompt={aiPrompt}
        >
            {activeNoteId ? (
                <Editor noteId={activeNoteId} onSummarize={handleSummarize} />
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    Select or create a note to start writing.
                </div>
            )}
        </NotesLayout>
    );
};

export default Notes;
