-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists document_sections (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade not null,
  content text, -- The text content of the chunk
  embedding vector(768), -- Gemini embedding size
  metadata jsonb -- Page number, etc.
);

-- Enable RLS
alter table document_sections enable row level security;

-- Policy: Users can only see their own embeddings (via resource ownership)
create policy "Users can view own embeddings"
on document_sections for select
using (
  exists (
    select 1 from resources
    where resources.id = document_sections.resource_id
    and resources.user_id = auth.uid()
  )
);

create policy "Users can insert own embeddings"
on document_sections for insert
with check (
  exists (
    select 1 from resources
    where resources.id = document_sections.resource_id
    and resources.user_id = auth.uid()
  )
);

create policy "Users can delete own embeddings"
on document_sections for delete
using (
  exists (
    select 1 from resources
    where resources.id = document_sections.resource_id
    and resources.user_id = auth.uid()
  )
);

-- Create a function to search for documents
create or replace function match_document_sections (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_user_id uuid,
  filter_resource_ids uuid[] default null
)
returns table (
  id uuid,
  resource_id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    document_sections.id,
    document_sections.resource_id,
    document_sections.content,
    1 - (document_sections.embedding <=> query_embedding) as similarity
  from document_sections
  join resources on resources.id = document_sections.resource_id
  where 1 - (document_sections.embedding <=> query_embedding) > match_threshold
  and resources.user_id = filter_user_id
  and (filter_resource_ids is null or document_sections.resource_id = any(filter_resource_ids))
  order by document_sections.embedding <=> query_embedding
  limit match_count;
end;
$$;
