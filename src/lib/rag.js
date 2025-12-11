import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabaseClient";
import { extractTextFromPDF } from "./pdfUtils";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
// Use a model capable of embeddings. gemini-embedding-exp-03-07 is optimal if available, else text-embedding-004
const EMBEDDING_MODEL_NAME = "text-embedding-004";

/**
 * Splits text into chunks of roughly maxChars.
 * Tries to split on paragraphs or sentences.
 */
const chunkText = (text, maxChars = 1000) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = start + maxChars;
        if (end < text.length) {
            // Find last period or newline before end
            const lastPeriod = text.lastIndexOf('.', end);
            const lastNewline = text.lastIndexOf('\n', end);
            if (lastPeriod > start + maxChars / 2) {
                end = lastPeriod + 1;
            } else if (lastNewline > start + maxChars / 2) {
                end = lastNewline + 1;
            }
        }
        chunks.push(text.slice(start, end).trim());
        start = end;
    }
    return chunks.filter(c => c.length > 20); // Filter tiny chunks
};

/**
 * Generates an embedding for a text string using Gemini.
 */
export const getEmbedding = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
};

/**
 * Ingests a file: Extracts text, chunks it, generates embeddings, and saves to DB.
 */
export const ingestFile = async (file, resourceId) => {
    console.log(`Ingesting file ${file.name} for resource ${resourceId}`);

    // 1. Extract Text
    let text = '';
    if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
    } else {
        // Fallback or text handling
        text = await file.text();
    }

    if (!text) throw new Error("No text extracted");

    // 2. Chunk
    const chunks = chunkText(text);
    console.log(`Split into ${chunks.length} chunks`);

    // 3. Embed & Save (Batching to avoid API limits)
    let processed = 0;
    const batchSize = 10; // Simple serial batching

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        try {
            const embedding = await getEmbedding(chunk);

            await supabase.from('document_sections').insert({
                resource_id: resourceId,
                content: chunk,
                embedding: embedding
            });
            processed++;
        } catch (err) {
            console.error(`Failed to ingest chunk ${i}`, err);
        }

        // rudimentary rate limiting
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`Ingestion complete. Processed ${processed}/${chunks.length} chunks.`);
    return true;
};

/**
 * Search for relevant context given a query and optional resource filters.
 */
export const searchContext = async (query, resourceIds = null, matchCount = 5) => {
    try {
        // 1. Embed Query
        const queryEmbedding = await getEmbedding(query);

        // 2. RPC Call
        const { data, error } = await supabase.rpc('match_document_sections', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5, // 0.6 might be too strict
            match_count: matchCount,
            filter_user_id: (await supabase.auth.getUser()).data.user.id,
            filter_resource_ids: resourceIds
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error searching context:", error);
        return [];
    }
};
