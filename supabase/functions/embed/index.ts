
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

console.log("Embed Function Initialized")

serve(async (req) => {
    try {
        const { resource_id, text_content } = await req.json()

        if (!text_content || !resource_id) {
            return new Response('Missing text_content or resource_id', { status: 400 })
        }

        // 1. Chunk the text (Simple character split for MVP)
        const chunks = chunkText(text_content, 1000); // Helper below

        // 2. Setup OpenAI
        const configuration = new Configuration({ apiKey: Deno.env.get('OPENAI_API_KEY') })
        const openai = new OpenAIApi(configuration)

        // 3. Setup Supabase
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 4. Generate Embeddings & Save
        const embeddingsData = []

        // Batch processing
        for (const chunk of chunks) {
            // OpenAI Embedding
            const embeddingResponse = await openai.createEmbedding({
                model: 'text-embedding-3-small',
                input: chunk,
            })
            const [{ embedding }] = embeddingResponse.data.data

            embeddingsData.push({
                resource_id,
                content: chunk,
                embedding,
            })
        }

        // 5. Insert into DB
        const { error } = await supabaseClient.from('embeddings').insert(embeddingsData)

        if (error) throw error

        return new Response(JSON.stringify({ success: true, chunks: chunks.length }), {
            headers: { "Content-Type": "application/json" },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
})

// Simple Chunker
function chunkText(text: string, size: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
    }
    return chunks;
}
