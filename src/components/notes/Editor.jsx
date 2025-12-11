import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, Save } from 'lucide-react';
import debounce from 'lodash.debounce';
import SlashMenu from './SlashMenu';
import '../../styles/SlashMenu.css';

const Editor = ({ noteId, onSummarize, onContentChange }) => {
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });

    // Save Functions
    const debouncedContentChange = useCallback(
        debounce((text) => {
            if (onContentChange) onContentChange(text);
        }, 1000),
        [onContentChange]
    );

    const saveContent = useCallback(
        debounce(async (id, newContent) => {
            setIsSaving(true);
            await supabase.from('notes').update({ content: newContent, updated_at: new Date() }).eq('id', id);
            setIsSaving(false);
        }, 1000),
        []
    );

    const saveTitle = useCallback(
        debounce(async (id, newTitle) => {
            setIsSaving(true);
            await supabase.from('notes').update({ title: newTitle || 'Untitled', updated_at: new Date() }).eq('id', id);
            setIsSaving(false);
        }, 1000),
        []
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Placeholder.configure({ placeholder: "Type '/' for commands..." }),
        ],
        editorProps: {
            attributes: { class: 'prose prose-lg focus:outline-none' },
            handleKeyDown: (view, event) => {
                if (event.key === '/') {
                    // Get viewport coordinates directly for fixed positioning
                    const { bottom, left } = view.coordsAtPos(view.state.selection.from);
                    setSlashMenuPosition({
                        top: bottom + 10, // Slightly below the line
                        left: left
                    });
                    setShowSlashMenu(true);
                    return false; // Allow '/' to be inserted
                }
                if (showSlashMenu && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter')) {
                    // Let SlashMenu handle it via window listener? 
                    // SlashMenu has window listener, so we shouldn't stop propagation here unless we manually pass it.
                    // Actually SlashMenu uses window listener.
                }
                return false;
            }
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            saveContent(noteId, json);
            // Notify parent of content text for AI context
            const text = editor.getText();
            debouncedContentChange(text);

            // Auto-hide slash menu if slash is deleted
            if (showSlashMenu) {
                const { from } = editor.state.selection;
                const textBefore = editor.state.doc.textBetween(from - 1, from, '\n', '\0');
                if (textBefore !== '/') {
                    setShowSlashMenu(false);
                }
            }
        },
        onSelectionUpdate: ({ editor }) => {
            // Hide if user selects text or moves cursor far away (simplified)
            // Actually handled by onUpdate check for '/', but if simply clicking elsewhere:
            if (showSlashMenu) {
                const { from } = editor.state.selection;
                const textBefore = editor.state.doc.textBetween(from - 1, from, '\n', '\0');
                if (textBefore !== '/') {
                    setShowSlashMenu(false);
                }
            }
        },
    }, [noteId]);

    // Load Data
    useEffect(() => {
        if (!noteId || !editor) return;

        const loadNote = async () => {
            // Reset state first to avoid stale data
            setTitle('');
            editor.commands.setContent('');
            setShowSlashMenu(false);

            const { data } = await supabase.from('notes').select('title, content').eq('id', noteId).single();
            if (data) {
                setTitle(data.title);
                editor.commands.setContent(data.content || {});
            }
        };
        loadNote();
    }, [noteId, editor]);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        saveTitle(noteId, newTitle);
    };

    const handleSlashCommand = (command) => {
        setShowSlashMenu(false);
        if (command === 'close') return;

        // Remove the '/' that triggered it
        // editor.chain().focus().deleteRange({ from: pos-1, to: pos }).run() ?
        // Simplified: just run command. User can delete '/' manually if needed 
        // Or better: delete last char. 
        editor.commands.deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from });

        // Execute logic based on command (defined inside SlashMenu actions actually, 
        // but SlashMenu component calls them directly on editor passed props)
        // Wait, SlashMenu component defines actions itself and calls onCommand just to close?
        // Ah, SlashMenu calls "command.action()" which usually runs editor command.
    };

    if (!editor) return null;

    return (
        <div className="editor-container" style={{ position: 'relative' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled Note"
                    className="editor-title-input"
                    style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', border: 'none', width: '100%', outline: 'none', color: 'var(--color-ink-blue)', background: 'transparent' }}
                />
                <div style={{ color: '#cbd5e1' }}>
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                </div>
            </div>

            <EditorContent editor={editor} />

            {showSlashMenu && (
                <SlashMenu
                    editor={editor}
                    onCommand={(cmd) => {
                        if (cmd === 'close') {
                            setShowSlashMenu(false);
                            return;
                        }

                        if (cmd === 'summarize') {
                            setShowSlashMenu(false);
                            // Extract text content from editor
                            const text = editor.getText();
                            if (onSummarize) onSummarize(text);
                            // Also delete the slash? The handleSlashCommand logic handles deletion for other commands?
                            // This onCommand bypasses handleSlashCommand if we don't call it.
                            // We should clear the slash manually here.
                            editor.commands.deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from });
                            return;
                        }

                        // For other commands initiated by SlashMenu directly acting on editor
                        // We might just need to close
                        setShowSlashMenu(false);
                        // Some commands in SlashMenu call editor.chain... directly, so we just need close.
                    }}
                    position={slashMenuPosition}
                />
            )}
        </div>
    );
};

export default Editor;
