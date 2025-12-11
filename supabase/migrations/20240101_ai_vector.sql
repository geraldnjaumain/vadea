-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists embeddings (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade not null,
  content text, -- The text content of the chunk
  embedding vector(1536), -- OpenAI embedding size
  metadata jsonb -- Page number, etc.
);

-- Enable RLS
alter table embeddings enable row level security;

-- Policy: Users can only see their own embeddings (via resource ownership)
create policy "Users can view own embeddings"
on embeddings for select
using (
  exists (
    select 1 from resources
    where resources.id = embeddings.resource_id
    and resources.user_id = auth.uid()
  )
);

create policy "Users can insert own embeddings"
on embeddings for insert
with check (
  exists (
    select 1 from resources
    where resources.id = embeddings.resource_id
    and resources.user_id = auth.uid()
  )
);

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_user_id uuid
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
    embeddings.id,
    embeddings.resource_id,
    embeddings.content,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  from embeddings
  join resources on resources.id = embeddings.resource_id
  where 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  and resources.user_id = filter_user_id
  order by embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;
