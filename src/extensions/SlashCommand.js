import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('slashCommand'),

                state: {
                    init() {
                        return {
                            active: false,
                            range: null,
                            query: '',
                        };
                    },

                    apply(tr, state) {
                        const { selection } = tr;
                        const { $from } = selection;

                        // Check if we're at the start of a line or after whitespace
                        const textBefore = $from.parent.textBetween(
                            Math.max(0, $from.parentOffset - 20),
                            $from.parentOffset,
                            null,
                            '\ufffc'
                        );

                        // Match slash command pattern
                        const match = textBefore.match(/\/(\w*)$/);

                        if (match) {
                            return {
                                active: true,
                                range: {
                                    from: $from.pos - match[0].length,
                                    to: $from.pos,
                                },
                                query: match[1],
                            };
                        }

                        return { active: false, range: null, query: '' };
                    },
                },

                props: {
                    decorations(state) {
                        const { active, range } = this.getState(state);

                        if (!active || !range) {
                            return DecorationSet.empty;
                        }

                        return DecorationSet.create(state.doc, [
                            Decoration.inline(range.from, range.to, {
                                class: 'slash-command-decoration',
                            }),
                        ]);
                    },

                    handleKeyDown(view, event) {
                        const { active, query } = this.getState(view.state);

                        if (!active) return false;

                        // Emit custom event to show menu
                        if (event.key === '/' || query.length > 0) {
                            const customEvent = new CustomEvent('slashCommand', {
                                detail: { query, active: true },
                            });
                            window.dispatchEvent(customEvent);
                        }

                        return false;
                    },
                },
            }),
        ];
    },
});
